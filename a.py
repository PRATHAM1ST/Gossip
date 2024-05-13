from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Sample documents
documents = [
    "This is the first document.",
    "This document is the second document.",
    "And this is the third one.",
    "Is this the first document?",
]

# Preprocessing
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [stemmer.stem(token) for token in tokens if token.isalnum() and token not in stop_words]
    return ' '.join(tokens)

preprocessed_documents = [preprocess_text(doc) for doc in documents]

# TF-IDF Calculation
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(preprocessed_documents)

# Search
query = "This is the first document."
query = preprocess_text(query)
query_vector = vectorizer.transform([query])

# Calculate cosine similarity between query and documents
cosine_similarities = np.dot(query_vector, tfidf_matrix.T).toarray()

# Get top N documents based on similarity scores
top_n = 2
top_indices = cosine_similarities.argsort(axis=1)[0, :-top_n-1:-1]

for index in top_indices:
    print(f"Document: {documents[index]}, Similarity Score: {cosine_similarities[0, index]}")
