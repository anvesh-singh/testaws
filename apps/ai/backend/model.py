import json
import sys
import tensorflow as tf
import tensorflow_hub as hub
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.neighbors import NearestNeighbors
import ast
import joblib

# Load data & tags classes
df = pd.read_csv('udemy_courses_with_description_and_tags.csv', encoding='latin1')
df = df.rename(columns={'course_id':'session_id','course_title':'title','course_description':'description'})
df['tags'] = df['tags'].fillna('[]').apply(ast.literal_eval)
mlb = joblib.load('mlb_classes.joblib')

# Load embedder & model
embed = hub.load('https://tfhub.dev/google/universal-sentence-encoder/4')
model = tf.keras.models.load_model('skillbridge_model.h5')

# Precompute embeddings for recommendations
texts = df['title'].fillna('').tolist()
embeddings = embed(texts).numpy()
nn = NearestNeighbors(n_neighbors=5, metric='cosine').fit(embeddings)

# Read request
payload = json.loads(sys.stdin.read())
cmd = payload.get('command')
out = {}

if cmd == 'predict':
    title = payload['title']
    emb = embed([title]).numpy()
    preds = model.predict(emb)[0]
    top = sorted(enumerate(preds), key=lambda x: -x[1])[:payload.get('top_k',3)]
    out = [{'tag': mlb.classes_[i], 'score': float(score)} for i, score in top]

elif cmd == 'recommend':
    idx = int(payload['session_index'])
    distances, indices = nn.kneighbors([embeddings[idx]], n_neighbors=payload.get('n',3)+1)
    recs = []
    for i in indices[0][1:]:
        recs.append({
            'session_id': int(df.iloc[i]['session_id']),
            'title': df.iloc[i]['title'],
            'tags': df.iloc[i]['tags']
        })
    out = recs

else:
    out = {'error': 'Unknown command'}

print(json.dumps(out))