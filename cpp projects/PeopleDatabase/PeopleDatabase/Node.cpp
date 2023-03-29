//
//  Node.cpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/5/21.
//

#include <stdio.h>

//Creates class with given generic type E
template<typename E>
class Node{
private:
    E *element; //This is the node's element, can be any object
    Node *left; //This is the node's left  child, another node
    Node *right;//This is the node's right child, another node
    
public:
    //Constructors
    Node()
    {
        element = nullptr;
        left = nullptr;
        right = nullptr;
    }
    Node(E *element, Node *left, Node *right)
    {
        this->element = element;
        this->left = left;
        this->right = right;
    }
    //Get and set this Node's element
    //NOTE: Must take in a pointer to the element, otherwise it will not carry over fields!
    E* getElement(){
        return element;
        
    }
    void setElement(E *element){this->element = element;}
    
    //Get and set the left child of this Node
    Node* getLeft(){return left;}
    void setLeft(Node *left){this->left = left;}
    
    //Get and set the right child of this Node
    Node* getRight(){return right;}
    void setRight(Node *right){this->right = right;}
    
};
