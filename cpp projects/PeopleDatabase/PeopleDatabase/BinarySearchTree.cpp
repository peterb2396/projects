//
//  BinarySearchTree.cpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/4/21.
//

#include "BinarySearchTree.hpp"
#include <vector>
#include <stdio.h>
#include <iostream>

template<typename E>
class BinarySearchTree {
private:
    Node<E>* root;
    int count = 0;
    std::vector<E*> elements;
    
public:
    //Constructors for default and given element case
    BinarySearchTree(E *rootElement)
    {
        root = new Node<E>(rootElement, nullptr, nullptr);
    }
    
    void insert(E *element)
    {//If the tree is empty, make this the root. Otherwise make a new root with new children
        if (count == 0)
            root = new Node<E>(element, nullptr, nullptr);
        else
            insertRec(root, element);
        count++;
    }
    
    //Recursively insert the desired element
    Node<E>* insertRec(Node<E>* currentNode, E* element)
    {
        if (!currentNode)//if current node is null
        {
            currentNode = new Node<E>(element, nullptr, nullptr);
            return currentNode;
        }
        if (*element < *currentNode->getElement())//Element will be someplace in the left subtree.
            currentNode->setLeft(insertRec(currentNode->getLeft(), element));
        else if (*element > *currentNode->getElement())//Element is someplace in the right subtree.
            currentNode->setRight(insertRec(currentNode->getRight(), element));
        
        return currentNode;
    }
    
    void remove(E* element)
    {//collect all elements and add to a new tree if not remove element
        elements = getElements();
        count = 0;
        
        for (E* elem: getElements())
            if (elem != element)
                insert(elem);
    }

    //Initiate a binary search using the given parameter as a search key
    std::vector<E*> search(std::string key)
    {
        elements.clear();
        return searchRec(root, lowercase(key));
        
    }
    
    //Recursive search called by search given key starting at root. (not case sens)
    std::vector<E*> searchRec(Node<E> *current, std::string key)
    {
        if (current) {
            searchRec(current->getLeft(), key);
            
            if (lowercase(current->getElement()->toString()).find(key) != std::string::npos)
                elements.push_back(current->getElement());
                
            searchRec(current->getRight(), key);
        }
        return elements;
    }
    
    //Call function to traverse and return BST inorder
    std::vector<E*> getElements() {
        elements.clear();
        return getElementsRec(root);
    }
    //Recursively return all elements inorder
    std::vector<E*> getElementsRec(Node<E> *current)
    {
        //NOTE: checks to see if we still have leaf nodes to recognize
        if (current) {
            getElementsRec(current->getLeft());
            elements.push_back(current->getElement());
            getElementsRec(current->getRight());
           
        }
        else
        {//Traversal is finished, no more nodes to access
            return elements;
        }
        return elements;
    }
    
    //Convert given string to all lowercase for case insensitive comparison
    std::string lowercase(std::string str)
    {
        std::string result = "";
        for (char c: str)
            result += ::tolower(c);
        return result;
    }
    
    //Return the quantity of nodes in the BST
    int getCount() {return count;}
};
