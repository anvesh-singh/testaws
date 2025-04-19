#!/usr/bin/env python3

import os
import ast
import numpy as np
import pandas as pd
import sentencepiece as spm
import tensorflow as tf
import tensorflow_hub as hub
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
import joblib

# Cache TF-Hub models locally
os.environ['TFHUB_CACHE_DIR'] = os.path.expanduser('~/.tfhub_cache')

def load_data(csv_path):
    """Load and preprocess the Udemy courses CSV."""
    df = pd.read_csv(csv_path, encoding='latin1')
    df = df.rename(columns={
        'course_id': 'session_id',
        'course_title': 'title',
        'course_description': 'description'
    })
    df['tags'] = df['tags'].fillna('[]').apply(ast.literal_eval)
    return df


def setup_lite_use():
    """Load the lite USE module and its SentencePiece model."""
    # Disable TF2 eager to use hub.Module (TF1 style API)
    tf.compat.v1.disable_eager_execution()
    module_url = "https://tfhub.dev/google/universal-sentence-encoder-lite/2"
    module = hub.Module(module_url)

    # Placeholder for SparseTensor input using TF1 compatibility
    input_ph = tf.compat.v1.sparse_placeholder(tf.int64, shape=[None, None])
    encodings = module(
        inputs=dict(
            values=input_ph.values,
            indices=input_ph.indices,
            dense_shape=input_ph.dense_shape
        )
    )

    # Retrieve SentencePiece model path
    with tf.compat.v1.Session() as sess:
        sess.run([tf.compat.v1.global_variables_initializer(), tf.compat.v1.tables_initializer()])
        spm_path = sess.run(module(signature="spm_path"))

    # Load SentencePiece processor
    sp = spm.SentencePieceProcessor()
    with tf.io.gfile.GFile(spm_path, "rb") as f:
        sp.LoadFromSerializedProto(f.read())

    return sp, input_ph, encodings


def to_sparse(sp, sentences):
    """Convert list of strings to SparseTensor components."""
    ids = [sp.EncodeAsIds(s) for s in sentences]
    max_len = max(len(x) for x in ids)
    values = [v for seq in ids for v in seq]
    indices = [[i, j] for i, seq in enumerate(ids) for j in range(len(seq))]
    dense_shape = (len(ids), max_len)
    return values, indices, dense_shape


def compute_embeddings(sp, input_ph, encodings, sentences):
    """Run a TF1 session to compute USE-lite embeddings."""
    values, indices, dense_shape = to_sparse(sp, sentences)
    with tf.compat.v1.Session() as sess:
        sess.run([tf.compat.v1.global_variables_initializer(), tf.compat.v1.tables_initializer()])
        embs = sess.run(
            encodings,
            feed_dict={
                input_ph.values: values,
                input_ph.indices: indices,
                input_ph.dense_shape: dense_shape
            }
        )
    return np.array(embs)


def build_model(input_dim, output_dim):
    """Define a simple MLP for multi-label classification."""
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(output_dim, activation='sigmoid')
    ])
    model.compile(
        loss='binary_crossentropy',
        optimizer='adam',
        metrics=['accuracy']
    )
    return model


def main():
    # File paths
    csv_path = 'udemy_courses_with_description_and_tags.csv'
    model_path = 'skillbridge_model.h5'
    classes_path = 'mlb_classes.joblib'

    # Load data
    df = load_data(csv_path)
    titles = df['title'].fillna('').tolist()

    # Setup embedding
    print("Setting up USE-lite...")
    sp, input_ph, encodings = setup_lite_use()

    # Compute embeddings
    print("Computing embeddings...")
    X = compute_embeddings(sp, input_ph, encodings, titles)

    # Prepare labels
    mlb = MultiLabelBinarizer()
    Y = mlb.fit_transform(df['tags'])

    # Train/test split
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=0.2, random_state=42
    )

    # Build and train model
    model = build_model(X.shape[1], Y.shape[1])
    history = model.fit(
        X_train, Y_train,
        epochs=20,
        batch_size=32,
        validation_data=(X_test, Y_test)
    )

    # Evaluate
    loss, accuracy = model.evaluate(X_test, Y_test)
    print(f"Test Loss: {loss:.4f}, Test Accuracy: {accuracy:.4f}")

    # Save artifacts
    print("Saving model and label binarizer...")
    model.save(model_path)
    joblib.dump(mlb, classes_path)
    print(f"Saved model to {model_path} and classes to {classes_path}")


if __name__ == '__main__':
    main()
