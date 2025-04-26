# model.py -- Lite USE inference (TF1-style)
# Requires: tensorflow==2.10.0, tensorflow-hub<0.12.0, sentencepiece, numpy, pandas, scikit-learn, joblib

#!/usr/bin/env python3
import sys
import json
import numpy as np
import pandas as pd
import joblib
import ast
import tensorflow as tf
import tensorflow_hub as hub
import sentencepiece as spm
from sklearn.neighbors import NearestNeighbors

# Disable TF2 eager to use TF1 hub.Module
tf.compat.v1.disable_eager_execution()

# Load lite USE Module
module_url = "https://tfhub.dev/google/universal-sentence-encoder-lite/2"
module = hub.Module(module_url)
# Sparse placeholder
input_ph = tf.compat.v1.sparse_placeholder(tf.int64, shape=[None, None])
encodings = module(inputs=dict(
    values=input_ph.values,
    indices=input_ph.indices,
    dense_shape=input_ph.dense_shape
))

# Initialize SentencePiece processor
def _load_spm():
    with tf.compat.v1.Session() as sess:
        sess.run([tf.compat.v1.global_variables_initializer(), tf.compat.v1.tables_initializer()])
        spm_path = sess.run(module(signature="spm_path"))
    sp = spm.SentencePieceProcessor()
    with tf.io.gfile.GFile(spm_path, "rb") as f:
        sp.LoadFromSerializedProto(f.read())
    return sp

sp = _load_spm()

# Helper to convert texts to sparse form
def _to_sparse(texts):
    ids = [sp.EncodeAsIds(text) for text in texts]
    maxlen = max(len(seq) for seq in ids)
    values = [v for seq in ids for v in seq]
    indices = [[i, j] for i, seq in enumerate(ids) for j in range(len(seq))]
    dense_shape = (len(ids), maxlen)
    return values, indices, dense_shape

# Compute embeddings for list of texts
def embed_texts(texts):
    values, indices, dense_shape = _to_sparse(texts)
    with tf.compat.v1.Session() as sess:
        sess.run([tf.compat.v1.global_variables_initializer(), tf.compat.v1.tables_initializer()])
        emb = sess.run(encodings, feed_dict={
            input_ph.values: values,
            input_ph.indices: indices,
            input_ph.dense_shape: dense_shape
        })
    return np.array(emb)

# Load artifacts and precompute all-course embeddings for recommendations
df = pd.read_csv('udemy_courses_with_description_and_tags.csv', encoding='latin1')
df = df.rename(columns={'course_id':'session_id','course_title':'title','course_description':'description'})
df['tags'] = df['tags'].fillna('[]').apply(ast.literal_eval)
mlb = joblib.load('mlb_classes.joblib')

# Precompute embeddings and NearestNeighbors
titles = df['title'].fillna('').tolist()
all_embs = embed_texts(titles)
nn = NearestNeighbors(n_neighbors=6, metric='cosine').fit(all_embs)

# Load trained classifier
model = tf.keras.models.load_model('skillbridge_model.h5')

# Read payload
payload = json.loads(sys.stdin.read())
cmd = payload.get('command')
out = None

if cmd == 'predict':
    title = payload.get('title', '')
    top_k = payload.get('top_k', 3)
    emb = embed_texts([title])
    preds = model.predict(emb)[0]
    top = sorted(enumerate(preds), key=lambda x: -x[1])[:top_k]
    out = [{'tag': mlb.classes_[i], 'score': float(score)} for i, score in top]

elif cmd == 'recommend':
    idx = int(payload.get('session_index', 0))
    n = payload.get('n', 3)
    dists, idxs = nn.kneighbors([all_embs[idx]], n_neighbors=n+1)
    recs = []
    for i in idxs[0][1:]:
        recs.append({
            'session_id': int(df.iloc[i]['session_id']),
            'title': df.iloc[i]['title'],
            'tags': df.iloc[i]['tags']
        })
    out = recs
else:
    out = {'error': f"Unknown command: {cmd}"}

# Write output
sys.stdout.write(json.dumps(out))
sys.stdout.flush()
