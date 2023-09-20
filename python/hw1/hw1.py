import numpy as np
import time

def load_data(path):
    try:
        with open(path, 'r') as file:
            rows = [line.split() for line in file.readlines()]
            return np.array(rows, dtype=float)
        
    # Handle errors with reading the input fi;e 
    except FileNotFoundError:
        print(f"File '{path}' not found!")
        return []
    except Exception as e:
        print(f"Error: {str(e)}")
        return []

# Calculate the mean of the data
# Note this will work with a regular array, or with a matrix!
# With a matrix, it will read one row vector at a time and sum down each column. Then scales the result mtx by 1/length.
def mean(data):
    sum = 0.0
    for x in data:
        sum += x
    return sum/len(data)

# Center the data by subtracting the mean from each data point
def center(data):
    u = mean(data)
    for x in data:
        x -= u

# by using the definition of sample covariance
def cov_1(data):
    start_time = time.time()

    n, d = data.shape  # n = samples, d = features
    E = np.zeros((d, d))  # Initialize the covariance matrix with zeros
    
    for i in range(d):
        for j in range(i, d):
            # Calculate covariance between i and j
            cov_ij = np.sum(data[:, i] * data[:, j]) / (n)
            
            # E is symettric, set both values
            E[i, j] = cov_ij
            E[j, i] = cov_ij


    finish_time = time.time()
    duration = (finish_time - start_time) * 1000  # MS
    print(f"cov_1 took {duration}ms")
    return E

# as a matrix product
def cov_2(data):
    start_time = time.time()

    # Multiple the matrices
    E = np.dot(data.T, data) / len(data)

    finish_time = time.time()
    duration = (finish_time - start_time) * 1000 
    print(f"cov_2 took {duration}ms")
    return E

# as sum of outer products
def cov_3(data):
    start_time = time.time()
    
    sum = 0
    # For each centered data point (row)
    for row in data:
        z = row.reshape((1, row.shape[0])) # Treat as 1xd matrix (DATA POINT)

        # sum the outer product
        sum += z * z.T

    # Multiply by 1/n
    E = sum/len(data)

    finish_time = time.time()
    duration = (finish_time - start_time) * 1000
    print(f"cov_3 took {duration}ms")
    return E






if __name__ == '__main__':
    inputs = ['hw1/hw1Data.txt']

    # For each dataset, process the following
    for input in inputs:
        data = load_data(input)

        # Proceed if successful load of file, otherwise try the next input (or finish)
        if data.any():
            #print(mean(data))
            center(data)
            cov_1(data)
            cov_2(data)
            cov_3(data)