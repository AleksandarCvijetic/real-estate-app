from sentence_transformers import SentenceTransformer

model = SentenceTransformer("intfloat/multilingual-e5-small")
q = model.encode("query: mali stan za studenta", normalize_embeddings=True)
d = model.encode(["passage: Garsonjera na Telepu, 25 m², namešteno.",
                  "passage: Porodična kuća sa dvorištem, 140 m², 4 sobe."],
                 normalize_embeddings=True)
print(len(q))   # dimenzija vektora
print(d @ q)    # cosine similarity upita sa svakim oglasom