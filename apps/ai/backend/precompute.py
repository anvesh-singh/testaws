#!/usr/bin/env python3
import os
import ast
import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
import tensorflow_hub as hub
import sentencepiece as spm
from sklearn.neighbors import NearestNeighbors

# 1) Load your CSV and mlb classes
df = pd.read_csv('udemy_courses_with_description_and_tags.csv', encoding='latin1')
df = df.rename(columns={'course_id':'session_id',
                        'course_title':'title',
                        'course_description':'description'})
df['tags'] = df['tags'].fillna('[]').apply(ast.literal_eval)

# 2) Build the USE‑lite embedder (same as in model.py)
tf.compat.v1.disable_eager_execution()
module = hub.Module("https://tfhub.dev/google/universal-sentence-encoder-lite/2")
input_ph = tf.compat.v1.sparse_placeholder(tf.int64, shape=[None, None])
encodings = module(inputs=dict(
    values=input_ph.values,
    indices=input_ph.indices,
    dense_shape=input_ph.dense_shape
))
with tf.compat.v1.Session() as sess:
    sess.run([tf.compat.v1.global_variables_initializer(),
              tf.compat.v1.tables_initializer()])
    spm_path = sess.run(module(signature="spm_path"))
sp = spm.SentencePieceProcessor()
with tf.io.gfile.GFile(spm_path, "rb") as f:
    sp.LoadFromSerializedProto(f.read())

def embed_texts(texts):
    ids = [sp.EncodeAsIds(t) for t in texts]
    maxlen = max(len(seq) for seq in ids)
    values  = [v for seq in ids for v in seq]
    indices = [[i,j] for i,seq in enumerate(ids) for j in range(len(seq))]
    shape   = (len(texts), maxlen)
    with tf.compat.v1.Session() as sess:
        sess.run([tf.compat.v1.global_variables_initializer(),
                  tf.compat.v1.tables_initializer()])
        emb = sess.run(encodings, feed_dict={
            input_ph.values: values,
            input_ph.indices: indices,
            input_ph.dense_shape: shape
        })
    return np.array(emb)

# 3) Compute embeddings and save
titles = df['title'].fillna('').tolist()
X = embed_texts(titles)
np.save('embeddings.npy', X)
print(f"Saved embeddings.npy (shape={X.shape})")

# 4) Fit & save the KNN index
nn = NearestNeighbors(n_neighbors=5, metric='cosine').fit(X)
joblib.dump(nn, 'nn_model.joblib')
print("Saved nn_model.joblib")

# 5) Save minimal metadata for recommendations
meta = {
    'session_ids': df['session_id'].tolist(),
    'titles':      df['title'].tolist(),
    'tags':        df['tags'].tolist()
}
joblib.dump(meta, 'meta.joblib')
print("Saved meta.joblib")
