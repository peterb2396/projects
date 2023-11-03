# Load the data
# Show boxplot (show outliers)
# Remove & print outliers

import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler, LabelEncoder
import numpy as np

# Step 1: Load data from a file
file_path = 'Info_UserData.csv'  # Update with your data file path
data = pd.read_csv(file_path)
feature_titles = list(data.columns)

# Step 2: Display a boxplot
data.boxplot()
plt.xticks(rotation=20)
plt.title("Boxplot of the Data")
plt.show()

# Step 5: Convert non-numeric data to numeric data
for column in data.columns:
    if data[column].dtype == 'object':
        label_encoder = LabelEncoder()
        data[column] = label_encoder.fit_transform(data[column])

# Step 4: Normalize the data
scaler = StandardScaler()
data = scaler.fit_transform(data)

# Step 3: Remove outliers using the Z-score method
z_scores = np.abs((data - data.mean()) / data.std())
data = data[(z_scores < 3).all(axis=1)]


plt.figure()
plt.boxplot(data, labels=feature_titles)
plt.xticks(rotation=20)
plt.title("Boxplot of the Resulting Data")
plt.show()