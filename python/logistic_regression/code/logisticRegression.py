###############################     INSTALLATION/PREP     ################
# This is a code template for logistic regression using stochastic gradient ascent to be completed by you 
# in CSI 431/531 @ UAlbany
#


###############################     IMPORTS     ##########################
import numpy as np
import pandas as pd
import math as mt
from numpy import linalg as li
import matplotlib.pyplot as plt

###############################     FUNCTION DEFINITOPNS   ##########################

"""
Receives data point x and coefficient parameter values w 
Returns the predicted label yhat, according to logistic regression.
"""
def predict(x, w):
    prod = np.dot(x, w) # Dot product of x and w
    np.seterr(over='ignore', under='ignore')
    yhat = 1 / (1 + np.exp(-prod)) # Estimation is sigmoid function of the above product, uses current w estimation
    return(yhat)
      
    
"""
Receives data point (x), data label (y), and coefficient parameter values (w) 
Computes and returns the gradient of negative log likelihood at point (x)
"""
def gradient(x, y, w):
    yhat = predict(x, w) # represents how the model currently classifies x
    error = yhat - y # how far off the model's prediction is
    gradient = -x * error 

    # Note that the above is equivalent to the below (which is found in the notes) but uses the predict function.
    gradient_also = (y - (1 / (1 + np.exp(-(np.dot(w.T, x)))))) * x
    
    return gradient


"""
Receives the predicted labels (y_hat), and the actual data labels (y)
Computes and returns the cross-entropy loss
"""
def cross_entropy(y_hat, y):
    y_hat = np.clip(y_hat, 1e-15, 1 - 1e-15) # Avoid taking log0 or log1
    return -np.sum(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat)) # cross entropy formula


"""
Receives data set (X), dataset labels (y), learning rate (step size) (psi), stopping criterion (for change in norm of ws) (epsilon), and maximum number of epochs (max_epochs)
Computes and returns the vector of coefficient parameters (w), and the list of cross-entropy losses for all epochs (cross_ent)
"""
def logisticRegression_SGA(X, y, psi, epsilon, max_epochs):
    epochs = 0 # iterations
    n, d = X.shape
    w = np.zeros(d)
    cross_entropies = []
    
    # Quit after max epochs
    while(epochs < max_epochs):
        y_hats = []
        w_prev = np.copy(w)
        
        # Shuffle the list
        shuffled = np.random.permutation(n)
        for i in shuffled:
            # For this random point:
            x_i = X.iloc[i]
            y_i = y[i]
            
            grad = gradient(x_i, y_i, w)

            # Update w with the new gradient with ascending method
            w += psi * grad

            # Realize the new prediction
            yhat = predict(x_i, w)
            y_hats.append(yhat)
        

        # Realize the cross entropy loss
        epochs+= 1
        cross_ent = cross_entropy(np.array(y_hats), y)
        cross_entropies.append(cross_ent)

        # Quit if epsilon is met
        if np.linalg.norm(w - w_prev) < epsilon:
            break
        
    
    return(w,cross_entropies)    
  
  
if __name__ == '__main__':  
    ## initializations and config
    psi=0.1 # learning rate or step size
    epsilon = 10 # used in SGA's stopping criterion to define the minimum change in norm of w
    max_epochs = 8 # used in SGA's stopping criterion to define the maximum number of epochs (iterations) over the whole dataset
    
    ## loading the data
    df_train = pd.read_csv("cancer-data-train.csv", header=None)
    df_test = pd.read_csv("cancer-data-test.csv", header=None)
    
    ## split into features and labels
    X_train, y_train = df_train.iloc[:, :-1], df_train.iloc[:, -1].astype("category").cat.codes #Convert string labels to numeric
    X_test, y_test = df_test.iloc[:, :-1], df_test.iloc[:, -1].astype("category").cat.codes
    
    ## augmenting train data with 1 (X0)
    X_train.insert(0,'',1)
    X_test.insert(0,'',1)
    
    
    ## learning logistic regression parameters
    [w, cross_ent] = logisticRegression_SGA(X_train, y_train, psi, epsilon, max_epochs)
    
    
    
    
    ## plotting the cross-entropy across epochs to see how it changes
    plt.plot(cross_ent, 'o', color='black')
    #print(cross_ent)
    plt.show()
    
    
    """
      calculate and print the average cross-entropy error for training data (cross-entropy error/number of data points)
    """
    avg_cross_entropy_train = np.mean(cross_ent) / len(y_train)
    print("Average Cross-Entropy Error for Training Data:", avg_cross_entropy_train)

    
    """
      predict the labels for test data points using the learned w's
    """
    test_predictions = [int(predict(x, w)) for index, x in X_test.iterrows()]
    print("Test Predictions:",test_predictions)
    
    
    """
      calculate and print the average cross-entropy error for testing data (cross-entropy error/number of data points)
    """
    cross_ent_test = cross_entropy(np.array(test_predictions), y_test)
    avg_cross_entropy_test = cross_ent_test / len(y_test)
    print("Average Cross-Entropy Error for Testing Data:", avg_cross_entropy_test)

  
