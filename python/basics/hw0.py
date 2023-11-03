
# 1- Install and Test Python Environment Install python 3 environment, save the following
# code with name "hw0.py" (note that python is indentation sensitive), and run it in the
# terminal with "python hw0.py" or in your preferred IDE
def test_print():
    print ("Hello world!")

# 2- Define Objects Define a function called 'list_set_length' to assign items_list= [2, 1, 2, 3,
# 4, 3, 2, 1] as a list object, and items_set = {2, 1, 2, 3, 4, 3, 2, 1} as a set object. Use the
# len function, print the size of the list and size of the set.
def list_set_length():
    items_list = [2, 1, 2, 3, 4, 3, 2, 1]
    items_set = {2, 1, 2, 3, 4, 3, 2, 1}
    print(f'Size of list {items_list}:\n', len(items_list))
    print('')
    print(f'Size of set {items_set}:\n', len(items_set))

# 3- Without using the intersection operator (&), write
# a function called 'set_intersect' that uses comprehension to returns the intersection of S
# and T. Hint: Use a membership test in a conditional statement at the end of the comprehension. Ex: {x*y for x in {1,2,3} for y in {2,3,4}}
def set_intersect():
    S = {1,4,7}
    T = {1,2,3,4,5,6}
    intersect = {x for x in S if x in T}
    print(f'Intersection of {S} and {T}: \n', intersect)

# 4- Tuples: Suppose S is a set of integers, e.g. {−4,−2, 1, 2, 5, 0}. Write a function
# 'three_tuples' that includes a triple comprehension and returns a list of all three-
# element tuples (i, j, k) such that i, j, k are elements of S whose sum is zero.
def three_tuples():
    S = {-4,-2, 1, 2, 5, 0}
    res = {(a, b, c) for a in S for b in S for c in S if a + b + c == 0}
    print('The following are element tuples (i, j, k) such that i, j, k are elements of S whose sum is zero:\n', res)


# 5 - 
# # a) Write a function 'dict_init' to initialize the following dictionary:
# mydict = {'Hopper':'Grace', 'Einstein':'Albert', 'Turing':'Alan', 'Lovelace':'Ada'}
# b) Suppose dlist is a list of dictionaries and k is a key. Write a function 'dict_find' that
# receives dlist and k, and uses a comprehension to return a list whose i th element is
# the value corresponding to key k in the ith dictionary in dlist. If a dictionary does not
# contain k as one of its keys, use 'NOT PRESENT' for that dictionary.
def dict_test():
    test_key = 'city'
    dlist = [
        {'name': 'Alice', 'age': 28, 'city': 'New York'},
        {'name': 'Eve', 'age': 29, 'occupation': 'Doctor'},
        {'name': 'Bob', 'age': 35, 'city': 'Los Angeles'},
        {'name': 'Charlie', 'age': 22, 'city': 'Chicago'},
        {'name': 'David', 'age': 40, 'occupation': 'Engineer'},     
    ]
    mylist = dict_find(dlist, test_key )
    print("The following is a list whose i'th element is the value of key '"+test_key+"' for the i'th dictionary provided: \n",mylist)

def dict_init():
    mydict = {'Hopper':'Grace', 'Einstein':'Albert', 'Turing':'Alan', 'Lovelace':'Ada'}
    print('Initialized the following dictionary: \n', mydict)

def dict_find(dlist, k):
    mylist = [d.get(k, 'NOT PRESENT') for d in dlist]
    return mylist


# 6- File reading: Write a function 'file_line_count' to open a file and return the number of
# lines that it has. Try out your function on stories.txt.
def file_line_count(path):
    try:
        with open(path, 'r') as file:
            line_count = 0
            for line in file: 
                line_count += 1
        print(path, 'has ', line_count, ' lines!')
    except FileNotFoundError:
        print("File not found")

# 7 - Make document list to be used 
def construct_documents(path):
    try:
        with open(path, 'r') as file:
            documents = []
            for line in file: 
                documents.append(line)
        return documents
    except FileNotFoundError:
        print("File not found")
        return 0

# Write a procedure make_inverse_index(strlist) that, given a list of strings
# (documents), returns a dictionary that maps each word to the set consisting of the
# document numbers of documents in which that word appears. This dictionary is
# called an inverse index. (Hint: use enumerate.)
def make_inverse_index(strlist):
    inverse_index = {}
    
    for index, document in enumerate(strlist):
        words = document.split()
        for word in words:
            if word in inverse_index:
                # We already have a mapping of this word to a set of documents, so find the set and add this document index to it
                inverse_index[word].add(index)
            else:
                # Word has not been encountered yet, create a new set with this document number
                inverse_index[word] = {index}
    
    return inverse_index

# Write a procedure or_search(inverseIndex, query) which takes an inverse index and
# a list of words query, and returns the set of document numbers specifying all
# documents that contain any of the words in query.
def or_search(inverseIndex, query):
    result = set()
    for word, indeces in inverseIndex.items():
        if word in query:
            result.update(indeces)

    print('Document indeces containing ANY of the words', query, 'are\n', result)

# Write a procedure and_search(inverseIndex, query) which takes an inverse index
# and a list of words query, and returns the set of document numbers specifying all
# documents that contain all of the words in query.
def and_search(inverseIndex, query):
    # Make a list of sets, each set being the documents who have the query words
    # One set for each query word.
    # Intersection of all of these sets will be a set of documents containing all words.
    set_list = []

    for query_word in query:
        # Add all document indeces that contain this word to a set at position i. 
        set_list.append(inverseIndex.get(query_word, set())) # default to {} if word isnt present to denote absence of word

    intersection_set = set.intersection(*set_list)

                 
    print('Documents that contain ALL of the words', query, 'are\n', intersection_set if len(intersection_set) > 0 else 'none')

def most_similar(inverseIndex, query):
    # We can't base similarity off of word frequency, because we only have a binary inverse index.
    # The best way would be to loop over each document but I am required to only use inverseIndex.
    # So, similarity score will be determined by number of query words that occur at least once in the document

    similarityDict = {}
    similarDocuments = []
    # Loop over each query, we are not interested in the entire index!
    # For each query_word, get the documents that contain it.
    # Map each document to a similarity value (number of query words it contains)
    # If document is not present in the dictionary, initialize it with a value of 1
    for query_word in query:
        # For each document that contains this word...
        for document in inverseIndex.get(query_word):
            # Increase or initialize similarity score because the word was present
            similarityDict[document] = similarityDict[document] + 1 if document in similarityDict else 1

            # Use bubble sort to make a similarity list in the desired order
            similarDocuments = list(similarityDict.keys())
            n = len(similarDocuments)
            
            # Outer bubble loop results in bubbling the smallest value to the end of the list over each iteration
            for i in range(n - 1):
                # Inner bubble loop satisfies the goal of the outer loop by comparing each pair of elements and bubbling once in each iteration
                for j in range(n - i - 1):
                    if similarityDict[similarDocuments[j]] < similarityDict[similarDocuments[j + 1]]:
                        # Swap the documents if similarity score is increasing across the two documents
                        similarDocuments[j], similarDocuments[j + 1] = similarDocuments[j + 1], similarDocuments[j]
            
    print('The documents most similar to the query', query, '(the first documents contain the highest number of query words) are \n',similarDocuments)

            
# Test question 7 
def test_document_functions(path):
    # Construct the documents
    documents = construct_documents(path)
    inverse_index = make_inverse_index(documents)
    print('Inverse Index for word "fall": \n', inverse_index['fall'])
    print('')
    or_search(inverse_index, ['ball', 'fall', 'cheesy'])
    print('')
    and_search(inverse_index, ['again', 'for'])
    print('')
    most_similar(inverse_index, ['ball', 'held', 'finally'])

if __name__ == '__main__':
    test_print()
    print('')
    list_set_length()
    print('')
    set_intersect()
    print('')
    three_tuples()
    print('')
    dict_init()
    print('')
    dict_test()
    print('')
    file_line_count('stories.txt')
    print('')
    test_document_functions('stories.txt')
