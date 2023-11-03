
import math

# Split the data
def split(D, i, c):

	n = len(D[0])
	X, y = D

	Dy = ([], []) # Tuples of data and classes, X, Y
	Dn = ([], [])


	# For each data sample 
	for j in range(n):
		x = X[j] # Store the data point temporarily

		# If Xi <= c, data point meets split condition
		if (x[i] <= c):
			Dy[0].append(x)	   # Add the sample point to the data list
			Dy[1].append(y[j]) # Add the class to the class list

		else:
			Dn[0].append(x)	   # Add the sample point to the data list
			Dn[1].append(y[j]) # Add the class to the class list

	return Dy, Dn



"""Compute the Information Gain of a split on attribute index at value
	for dataset D.
	
	Args:
		D: a dataset, tuple (X, y) where X is the data, y the classes
		index: the index of the attribute (column of X) to split on
		value: value of the attribute at index to split at

	Returns:
		The value of the Information Gain for the given split
	"""
def IG(D, index, value):
	n = len(D[0]) # Length of original data

	# Compute entropy of data where D is a tuple of value 2 being a list of classes
	def find_entropy(y):
		
		counts = [0, 0] # Contains two integers both initialized to 0

		for classification in y:
			counts[classification] += 1 # Increase the count of index 0 or 1 by 1

			
		entropy = 0.0
		# Entropy is the sum from 1 to 2
		for i in range (2):
			
			probability = (counts[i] / len(y)) if len(y) else 0

			# Avoid domain error for trying to find log0
			if (probability):
				entropy -= probability * math.log2(probability)
		
		return entropy


	def find_split_entropy(i, c):
		# CALCULATE SPLIT ENTROPY	

		# Split the data
		Dy, Dn = split(D, i, c)

		# Obtain lengths of split datasets
		Ny = len(Dy[0])
		Nn = len(Dn[0])

		return (Ny/n * find_entropy(Dy[1])) + (Nn/n * find_entropy(Dn[1]))
	
	# Main computations
	entropy = find_entropy(D[1])
	split_entropy = find_split_entropy(index, value)
	
	return entropy - split_entropy


	
	

"""Compute the Gini index of a split on attribute index at value
	for dataset D.

	Args:
		D: a dataset, tuple (X, y) where X is the data, y the classes
		index: the index of the attribute (column of X) to split on
		value: value of the attribute at index to split at

	Returns:
		The value of the Gini index for the given split
	"""
def G(D, index, value):
	n = len(D[0]) # Length of original data

	def find_gini(y):
		counts = [0, 0] # Contains two integers both initialized to 0

		for classification in y:
			counts[classification] += 1 # Increase the count of index 0 or 1 by 1

		gini = 1.0
		for i in range (2):
			gini -= math.pow(counts[i] / len(y) if len(y) else 0, 2)

		return gini


	# Compute gini of the split
	def find_split_gini(i, c):
		# Split the data
		Dy, Dn = split(D, i, c)

		# Obtain lengths of split datasets
		Ny = len(Dy[0])
		Nn = len(Dn[0])

		return (Ny/n * find_gini(Dy[1])) + (Nn/n * find_gini(Dn[1]))
	
	return find_split_gini(index, value)



"""Compute the CART measure of a split on attribute index at value
	for dataset D.

	Args:
		D: a dataset, tuple (X, y) where X is the data, y the classes
		index: the index of the attribute (column of X) to split on
		value: value of the attribute at index to split at

	Returns:
		The value of the CART measure for the given split
	"""
def CART(D, index, value):
	Dy, Dn = split(D, index, value)

	n = len(D[0]) # Length of original data
	Ny = len(Dy[1])
	Nn = len(Dn[1])

	counts_Dy = [0, 0]
	counts_Dn = [0, 0]

	# Classifications in Dy
	for classification_Y in Dy[1]:
		counts_Dy[classification_Y] += 1 # Increase the count of index 0 or 1 by 1

	# Classifications in Dn
	for classification_N in Dn[1]:
		counts_Dn[classification_N] += 1 # Increase the count of index 0 or 1 by 1


	sum = 0.0
	for i in range (2):
		sum += abs(((counts_Dy[i] / Ny) if Ny else 0) - ((counts_Dn[i] / Nn) if Nn else 0))

	return 2 * Ny/n * Nn/n * sum 



"""Computes the best split for dataset D using the specified criterion

	Args:
		D: A dataset, tuple (X, y) where X is the data, y the classes
		criterion: one of "IG", "GINI", "CART"

	Returns:
		A tuple (i, value) where i is the index of the attribute to split at value
	"""
def bestSplit(D, criterion):

	# Init
	best_index = -1   # Index to split on
	best_value = None # Value to split on
	best_result = 1.0 if criterion == "GINI" else 0.0 # Initialize worst case

	funcs = {
    "GINI": G,
    "IG": IG,
    "CART": CART
}
	# Find the best split
	for i in range(len(D[0][0])):
		# Iterate down the column and compute gini/cart/IG on each unique value
		for j in range(len(D[0])):

			# Find value at this location
			value = D[0][j][i]

			# Calculate GINI, IG or CART
			result = funcs[criterion](D, i, value)
			if (result < best_result if criterion == "GINI" else result > best_result):
				best_index = i
				best_value = value
				best_result = result

	#print(criterion, best_result)

	return (best_index, best_value)

	

def load(filename):
	X = []  # observations
	y = []  # classes

    # Open the file
	with open(filename, 'r') as file:
		for line in file:
			values = line.split(',')

			X.append([float(val) for val in values[:-1]])
			y.append(int(values[-1]))

	return (X, y)


"""Builds a single-split decision tree using the Information Gain criterion
	and dataset train, and returns a list of predicted classes for dataset test

	Args:
		train: a tuple (X, y), where X is the data, y the classes
		test: the test set, same format as train

	Returns:
		A list of predicted classes for observations in test (in order)
	"""
def classifyIG(train, test):
	return classify("IG", train, test)

	

"""Builds a single-split decision tree using the GINI criterion
	and dataset train, and returns a list of predicted classes for dataset test

	Args:
		train: a tuple (X, y), where X is the data, y the classes
		test: the test set, same format as train

	Returns:
		A list of predicted classes for observations in test (in order)
	"""
def classifyG(train, test):
	return classify("GINI", train, test)

	

"""Builds a single-split decision tree using the CART criterion
	and dataset train, and returns a list of predicted classes for dataset test

	Args:
		train: a tuple (X, y), where X is the data, y the classes
		test: the test set, same format as train

	Returns:
		A list of predicted classes for observations in test (in order)
	"""
def classifyCART(train, test):
	return classify("CART", train, test)
	

# Helper to classify based on arbitrary method
def classify(criterion, train, test):
	# Find the best split on the training data
	i, c = bestSplit(train, criterion)
	classifications = []
	errors = 0
	
	# For each data point in test, make a decision
	for row in range(len(test[0])):
		sample = test[0][row][i]
		true_class = test[1][row]

		if criterion == "CART":
			classification = 1 if sample <= c else 0
		else: 
			classification = 0 if sample <= c else 1

		if (true_class != classification):
			errors+=1

		classifications.append(classification)

	print(criterion, classifications, "Errors:", errors)
	return classifications



def main():
	"""This portion of the program will run when run only when main() is called.
	This is good practice in python, which doesn't have a general entry point 
	unlike C, Java, etc. 
	This way, when you <import HW2>, no code is run - only the functions you
	explicitly call.
	"""
	D = load("train.txt")
	test = load("test.txt")

	for criterion in ["IG", "CART", "GINI"]:
		print(criterion, "best split:", bestSplit(D, criterion))

	print('')

	classifyIG(D, test)
	classifyCART(D, test)
	classifyG(D, test)
	
	


if __name__=="__main__": 
	"""__name__=="__main__" when the python script is run directly, not when it 
	is imported. When this program is run from the command line (or an IDE), the 
	following will happen; if you <import HW2>, nothing happens unless you call
	a function.
	"""
	main()