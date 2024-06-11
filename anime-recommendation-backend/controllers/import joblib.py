import joblib
import json

# Load the SVDpp model
model = joblib.load('svdpp_model.pkl')

# Get the trainset used to train the model
trainset = model.trainset

# Extract user-item interactions from the trainset
user_item_interactions = [(trainset.to_raw_uid(uid), trainset.to_raw_iid(iid), rating) 
                          for (uid, iid, rating) in trainset.all_ratings()]

# Serialize the model parameters and user-item interactions
serialized_model = {
    'model_type': 'SVDpp',
    'model_params': model.__dict__,
    'user_item_interactions': user_item_interactions
}

# Save the serialized model to a JSON file
with open('svdpp_model.json', 'w') as json_file:
    json.dump(serialized_model, json_file)
