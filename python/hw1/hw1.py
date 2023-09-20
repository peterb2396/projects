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
def center(D):
    Z = np.copy(D)
    u = mean(D)
    for x in Z:
        x -= u
    
    return Z

# by using the definition of sample covariance O(d^2)
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

# as a matrix product, O(d)
def cov_2(data):
    start_time = time.time()

    # Multiple the matrices
    E = np.dot(data.T, data) / len(data)

    finish_time = time.time()
    duration = (finish_time - start_time) * 1000 
    print(f"cov_2 took {duration}ms")
    return E

# as sum of outer products, O(d^3)
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

# Find optimal dimension, r, to reduce D to that keeps a ratio of variance
def find_r(Y, a):

    # store original dimension
    d = Y.shape[0]

    # Calculate the original variance to compute ratio f(r)
    og_var = 0
    for i in range(d): 
        y = Y[i]
        og_var += y
    # Compute f(r) for each 1 <= r < d until f(r) >= a
    # Break when we find so that we dont waste memory
    for r in range(1, d):

        # Sum the first r eigen values: Projected Variance
        proj_var = 0
        for i in range(r):
            y = Y[i]
            proj_var += y
        
        # Calculate realized variance
        var_ratio = proj_var / og_var

        # Success if this ratio is >= a (executes at most once)
        if (var_ratio >= a):
            # Determine the number of principal components (PCs) r that will ensure 100a% retained variance
            print("There are %d PCs that maintain at least %.5f ratio of variance" % (d - r + 1, a))
            print("The provided matrix was reduced to %d %s with an accuracy of %.5f" % (r, ("dimensions" if r > 1 else "dimension"), var_ratio))
            return r
        
    # PCA Fails
    return -1



# PCA Function for this data and alpha value
def PCA(D, a):
    # Proceed if successful load of file, otherwise try the next input (or finish)
        if D.any():
            # center the data as a new matrix, Z
            Z = center(D)
            E = cov_2(Z)
            Y, U = np.linalg.eig(E) # Eigen values = _, eigen vectors = U

            r = find_r(Y, a)

            if (r == -1):
                # Not possible to reduce dimension based on alpha
                return np.empty([1,1])


            # We can reduce to r dimensions! Proceed:

            n, d = D.shape # dimensions of the data

            # initialize result matrix, nxr
            A = np.zeros((n, r))
            U_r = U[:, :r] # Consider first r eigen vectors (cols)

            # for each data point (row)..
            for i in range(n):
                d = D[i].reshape(1, -1).T
        
                # New data sample (row) is U^T (row) * original data sample (col)
                A[i, :] = np.dot(U_r.T, d) # result must be 1xr. 
            
            # return the reduced dimensionality array!
            return A
                
            

                



if __name__ == '__main__':
    inputs = ['hw1/hw1Data.txt']

    # For each dataset, process the following
    for input in inputs:
        data = load_data(input)
        A = PCA(data, 0.9)

        if(A.any()):
            print(A)
        else:
            # Failed to find reduced mtx
            print("Not possible to reduce dimensions")

        

