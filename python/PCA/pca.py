import numpy as np
import time
import matplotlib.pyplot as plt
import os
import tkinter as tk
from tkinter import simpledialog

debug = False
source = ''
input_path = source+'input'

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

    if debug:
        finish_time = time.time()
        duration = (finish_time - start_time) * 1000 
        print(f"cov_1 took {duration}ms")

    return E

# as a matrix product, O(d)
def cov_2(data):
    start_time = time.time()

    # Multiple the matrices
    E = np.dot(data.T, data) / len(data)
    
    if debug:
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
    if debug:
        finish_time = time.time()
        duration = (finish_time - start_time) * 1000
        print(f"cov_3 took {duration}ms")

    return E

# Find optimal dimension, r, to reduce D to that keeps a ratio of variance
# Calculates retention for each dimension until we find one suitable for our needs (most optimal)
def find_r(Y, a):

    # store original dimension
    d = Y.shape[0]

    # Compute f(r) for each 1 <= r < d until f(r) >= a
    # Break when we find so that we dont waste memory
    for r in range(1, d):

        retention = calculate_retention(Y, r)

        # Success if this ratio is >= a (executes at most once)
        if (retention >= a):
            return r, retention
        
    # PCA Fails
    return -1, None

                
            
# Reduce the given data to a specified number of dimensions.
# If r >=1, reduce to exactly r dimensions
# If r < 1, execute PCA to find optimal dimension that retains r variance ratio
    # NOTE To attempt to retain 100% variance, pass 0. Passing 1 will attempt to reduce to 1 dimension.
def reduce(D, r):
    # Proceed if successful load of file, otherwise try the next input (or finish)
    if D.any():

        # center the data as a new matrix, Z
        Z = center(D)
        E = cov_2(Z)
        Y, U = np.linalg.eig(E) # Eigen values = Y, eigen vectors = U

        retention = 0
        if (r is not 0 and r < 1):
            # Find optimal dimension for this alpha value
            r, retention = find_r(Y, r)

            if (r == -1):
                # Not possible to reduce dimension based on alpha
                return np.empty([1,1]), -1, -1
        
        # We passed 0, try to retain 100% variance
        elif (r == 0):
            # Find optimal dimension for this alpha value
            r, retention = find_r(Y, 1)

            if (r == -1):
                # Not possible to reduce dimension based on alpha
                return np.empty([1,1]), -1, -1
            
        # We provided a dimension to (attempt to) reduce to, find retention
        else:
            retention = calculate_retention(Y, r)
            


        # NOTE * We now have the r-value (optimal dimension) and can reduce.

        n, d = D.shape # dimensions of the data

        # initialize result matrix, nxr
        A = np.zeros((n, r))
        U_r = U[:, :r] # Consider first r eigen vectors (cols)

        # for each data point (row)..
        for i in range(n):
            d = D[i].reshape(1, -1).T
            #A[i, :].reshape(A[i, :].shape[0], r)
            # New data sample (row) is U^T (row) * original data sample (col)
            A[i, :] = np.dot(U_r.T, d).T # result must be 1xr. 
        
        # return the reduced dimensionality array!
        return A, U_r, retention
                
# Calculate the ratio of variance preserved when reducing to r dimensions
def calculate_retention(Y, r):
    # Original dimension, d:
    d = Y.shape[0]

    # Calculate the original variance to compute ratio f(r)
    og_var = 0
    for i in range(d): 
        y = Y[i]
        og_var += y
    

    # Sum the first r eigen values: Projected Variance
    proj_var = 0
    for i in range(r):
        y = Y[i]
        proj_var += y
    
    # Calculate realized variance
    return( proj_var / og_var )

# Plot a 2D matrix, magnitude of each principal component on each dimension
# Save components to file
def plot(A, title, retention, U_r, dimensions):
    markers = ['o', 's', 'D', 'v', '^', '<', '>', '1', '2', '3', '4', '8', 's', 'p', '*', 'h', 'H', '+', 'x', '|', '_']
    colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k']

    if (A.shape[1] > 2):
        print('Couldnt plot reduced matrix because it has %d dimensions' % A.shape[1])
    
    # We can plot the new matrix!
    else:
        plt.scatter(A[:, 0], A[:, 1] if A.shape[1] == 2 else np.zeros(A.shape[0]), marker='o', color='blue', label= title, s=2)


        plt.xlabel('Component 1')
        plt.ylabel('Component 2' if A.shape[1] ==2 else None)
        plt.title('%dD Retained Variance: %.6f' % (A.shape[1], retention))
        plt.legend()

        plt.show()


    # Plot the diagnostics, regardless of dimension
    with open('./'+source+'/Components.txt', 'w') as file:
        for c in range(U_r.shape[1]):
            marker = markers[c % len(markers)]
            color = colors[c % len(colors)]

            x = [d for d in range (dimensions)] # List of d integers (the dimensions)
            y = [U_r[d, c] for d in x] # List of y values for this dimension
            label = 'PC%d' % (c + 1)

            plt.plot(x, y, linestyle='--', marker=marker, color=color, label= label)
            file.write(','.join(map(str, U_r[:, c])) + '\n')

        file.close()
    


    plt.xlabel('Dimension')
    plt.ylabel('Variance')
    plt.title('Projection Accuracy (%.2f)' % (retention * 100))
    plt.legend()

    plt.show()

# Execute and test PCA
def PCA(D, x):
    A, components, retention = reduce(D, x)

    if(A.any()):
        print("Reduced to %d %s, maintaining accuracy ratio of %.5f" % (components.shape[1], ("dimensions" if components.shape[1] > 1 else "dimension"),retention))
        plot(A, file, retention, components, data.shape[1])
        try:
            root.destroy()
        except:
            return


    else:
        # Failed to find reduced mtx
        print("Not possible to perform reduction")
        root = tk.Tk()
        root.title("Error")

        message_label = tk.Label(root, text="", font=("Arial", 14))
        message_label.pack(pady=20) 
        message_label.config(text="Dataset could not be reduced\nwith the given criteria.")

        root.mainloop()

if __name__ == '__main__':
    files = os.listdir(input_path)

    for file in files:
        file_path = os.path.join(input_path, file)
        print("\n\nANALYZING DATA FROM FILE '%s'\n----------------------------------" % file)

        # Load each dataset in the folder
        data = load_data(file_path)

    
        # Function to handle the button clicks
        def button_click(option):
            if option == "Retained Variance":
                while True:
                    value = simpledialog.askfloat("Test123", f"Enter a value between 0 and 1 pertaining to the ratio of variance required to be retained.\nYou will be presented with the lowest dimensional representation of the dataset that maintains at least this variance:")
                    if not (value > 1 or value < 0):
                        break
                if value == 1.0:
                    value = 0

                elif value == 0.0:
                    value = 0.001

                root.destroy()
                PCA(data, value)
                    

            elif option == "Explicit Dimension":
                while True:
                    value = simpledialog.askinteger("Test123", f"Enter an integer value from 1 to d to reduce your data to exactly these dimensions:")
                    if not (value < 1 or value > data.shape[1]):
                        break
                root.destroy()
                PCA(data, value)
                

        # Create the main window
        root = tk.Tk()
        root.title("Button Example")

        # Create a label with a message
        message_label = tk.Label(root, text="Analyzing dataset %s.\nWould you like to reduce dimensionality as far as possible while minimizing error to a certain threshold?\n\nOr, would you like to explicitly reduce the dimension?" % file)
        message_label.pack()

        # Create "Retained Variance" button
        button_retained_variance = tk.Button(root, text="Retained Variance", command=lambda: button_click("Retained Variance"))
        button_retained_variance.pack()

        # Create "Explicit Dimension" button
        button_explicit_dimension = tk.Button(root, text="Explicit Dimension", command=lambda: button_click("Explicit Dimension"))
        button_explicit_dimension.pack()

        # Start the Tkinter main loop
        root.mainloop()

        