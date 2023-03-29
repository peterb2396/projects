//
//  PeopleDatabase.hpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/5/21.
//

#ifndef PeopleDatabase_hpp
#define PeopleDatabase_hpp

#include "Person.cpp"
#include <stdio.h>

//Will add a person to the database
void addPerson(Person*);

//Will add a person to the database
void removePerson(Person*);

//Will return a vector of Persons matching search key
std::vector<Person*> search(std::string&);

//Will retrieve all people in the database
std::vector<Person*> people();

//Return size of the database
int size();

//Modify a member's birthday
void modifyBday(Person*, std::string);

#endif /* PeopleDatabase_hpp */
