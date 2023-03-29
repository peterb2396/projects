//
//  PeopleDatabase.cpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/5/21.
//

#include "PeopleDatabase.hpp"
#include <vector>
#include "BinarySearchTree.cpp"

class PeopleDatabase
{
    
private://Field of our tree associated with this database
    BinarySearchTree<Person> bst = *new BinarySearchTree<Person>(nullptr);
    
    
public:
    //Will add a person to the database
    void addPerson(Person *person)
    {
        bst.insert(person);
    }

    //Will remove a person from the database
    void removePerson(Person *person)
    {
        bst.remove(person);
    }

    //Will return a vector of Persons matching search key
    std::vector<Person*> search(std::string& key)
    {
        return bst.search(key);
    }

    //Will retrieve all people in the database
    std::vector<Person*> people()
    {
        return bst.getElements();
    }
        
    //Will modify a Person's bday in the database
    void modifyBday(Person *person, std::string newBday)
    {
        person->setBirthday(newBday);
    }
    
    //Return the amount of members
    int size()
    {
        return bst.getCount();
    }
};
