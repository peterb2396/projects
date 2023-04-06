//
//  BinarySearchTree.hpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/4/21.
//  Declares, but does not define functions for implementation in BST

#ifndef BinarySearchTree_hpp
#define BinarySearchTree_hpp

#include <stdio.h>
#include <string>
#include "Node.cpp"

//Insert the given element into the tree, at the correct location.
template<typename E>
void insert(E*);

//Recursively traverse this tree until the desired location is found, then insert the element.
//E is used to determine Node<E> in the next recursion, which will eventully be E's parent.
template<typename E>
Node<E>* insertRec(Node<E>*, E*);

//Remove all nodes containing the given element
template<typename E>
void remove(E*);

//Begin the search by providing a string. Will call searchRec
template<typename E>
std::vector<E*> search(std::string);

//Recursively search the tree given a string.
template<typename E>
std::vector<E*> searchRec(Node<E>*, std::string);

//Begin getElement recursion using root
template<typename E>
std::vector<E*> getElements();

//Return all elements in the tree, inorder, recursively
template<typename E>
std::vector<E*> getElementsRec(Node<E>*);

//Convert string to lowercase for suitable comparison
std::string lowercase(std::string);

//Return the number of nodes in BST
int getCount();

#endif /* BinarySearchTree_hpp */
