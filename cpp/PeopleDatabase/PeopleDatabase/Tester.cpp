//
//  Tester.cpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/6/21.
//

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include "PeopleDatabase.cpp"
#include <sstream>

void begin();
void importData();
void clearScreen(int);
void testList();
void testSearch();
void testAdd();
void testRemove();
void testModify();

PeopleDatabase database;
int action;
std::ifstream File;

int main()
{//Decomposed main. Starts testing
    begin();
    return 0;
}

    void begin()
    {//Begin testing the database using test file
        database = *new PeopleDatabase();
        importData();
        
        do {//Test loop
            std::cout << "What would you like to do? \n0: QUIT\n1: LIST ALL \n2: SEARCH \n3: ADD \n4: REMOVE \n5: MODIFY\n";
            
            std::cin >> action;
            clearScreen(10);
            switch (action) {
                case 1:
                    testList();
                    break;
                case 2:
                    testSearch();
                    break;
                case 3:
                    testAdd();
                    break;
                case 4:
                    testRemove();
                    break;
                case 5:
                    testModify();
                    break;
                default:
                    break;
            }
           
        } while (action > 0);
    }
    
    void importData()
    {
        std::string line;

        
        File.open ("SampleData.txt");
        if (!File) {
            std::cout << "Error: data file not found\n";
            exit(EXIT_FAILURE);
        }
        
        while (getline(File, line))
        {
            database.addPerson(new Person(line.substr(0, line.find("/")), line.substr(line.find("/")+1)));
        }
}

//Test listing of all people
void testList()
{
    std::cout << "Listing all members: \n";
    std::vector<Person*> members = database.people();
    
    std::cout << "---------------------------------------\n";
    for(Person* member: members)
    {
        std::cout << member->toString() << std::endl;
    }
    if (members.empty()) {std::cout << "No members!" << std::endl;}
    std::cout << "---------------------------------------\n";
}

void testSearch()
{
    std::string ser;
    
    std::cout << "Enter a criteria to search: ";
    std::cin >> ser;

    std::vector<Person*> members = database.search(ser);
    
    std::cout << "---------------------------------------\n";
    for(Person* member: members)
    {
        std::cout << member->toString() << std::endl;
    }
    if (members.empty()) {std::cout << "No matches!" << std::endl;}
    std::cout << "---------------------------------------\n";
}
void testAdd()
{
    std::string name;
    std::string bday;
    
    std::cout << "Enter a name to add: ";
    std::getline(std::cin >> std::ws, name);
    std::cout << "Enter birthday: ";
    std::getline(std::cin >> std::ws, bday);
    
    database.addPerson(new Person(name, bday));
    std::cout << "---------------------------------------\n";
    std::cout << "Added " << name << ", born " << bday << "!\n";
    std::cout << "---------------------------------------\n";
}
void testRemove()
{
    if (database.size() == 0)
    {
        std::cout << "---------------------------------------\n";
        std::cout << "No members remaining to be removed!";
        std::cout << "---------------------------------------\n";
        return;
    }
    std::string ser;
    
    std::cout << "Search for a person to remove: ";
    std::getline(std::cin >> std::ws, ser);
    std::vector<Person*> members = database.search(ser);
    
    std::cout << "---------------------------------------\n";
    if (members.empty()) {std::cout << "No member found!";}
    else if (members.size() == 1)
    {
        database.removePerson(members[0]);
        std::cout << "Removed " << members[0]->toString() << "!\n";
        std::cout << "---------------------------------------\n";
    }
    else
    {
        int response;
        
        std::cout << "0: REMOVE ALL\n";
        for (int i = 0; i<members.size(); i++)
        {
            std::cout << i+1 << ": " << members[i]->toString() << std::endl;
        }
        std::cout << "---------------------------------------\n";
        std::cout << "Multiple members found! Choose a number to remove: ";
        std::cin >> response;
        
        if (response == 0)
        {
            std::cout << "---------------------------------------\n";
            for (Person* member: members)
            {
                database.removePerson(member);
                std::cout << "Removed "<< member->toString() << std::endl;
            }
            std::cout << "---------------------------------------\n";
            return;
        }
        
        database.removePerson(members[response-1]);
        std::cout << "---------------------------------------\n";
        std::cout << "Removed "<< members[response-1]->toString() << std::endl;
        std::cout << "---------------------------------------\n";
    }
}
void testModify()
{
    //Not working - i think its because of a ref / ptr issue. Addition sln can be to delete the old user and re add to the tree, but deletion doesnt work!
    std::string ser;
    Person *member = nullptr;
    std::string newBday;
    
    std::cout << "Search for a user whose bday to modify: ";
    std::getline(std::cin >> std::ws, ser);

    std::vector<Person*> members = database.search(ser);
    
    if (members.empty()) {
        std::cout << "---------------------------------------\n";
        std::cout << "No member found!";
        std::cout << "---------------------------------------\n";
    }
    else if (members.size() == 1)
    {
        member = members[0];
    }
    else
    {
        int response;
        
        std::cout << "---------------------------------------\n";
        std::cout << "0: UPDATE ALL\n";
        for (int i = 0; i<members.size(); i++)
        {
            std::cout << i+1 << ": " << members[i]->toString() << std::endl;
        }
        std::cout << "---------------------------------------\n";
        std::cout << "Multiple members found! Choose who to modify: ";
        std::cin >> response;
        
        if (response == 0)
        {
            std::cout << "Enter new bday for the listed members: ";
            std::getline(std::cin >> std::ws, newBday);
            
            std::cout << "---------------------------------------\n";
            for (Person* person: members)
            {//Modify loop
                database.modifyBday(person, newBday);
                std::cout << "Updated bday of "<< person->getName() << std::endl;
            }
            std::cout << "---------------------------------------\n";
            return;
        }
        
        member = members[response-1];
    }
        std::cout << "Enter new bday for "<< member->getName()<<": ";
        std::getline(std::cin >> std::ws, newBday);
        
        database.modifyBday(member, newBday);
        std::cout << "---------------------------------------\n";
        std::cout << "Updated bday of "<< member->getName() << std::endl;
        std::cout << "---------------------------------------\n";
}
void clearScreen(int lines)
{
    for (int i = 0; i<lines; i++)
    {
        std::cout << std::endl;
    }
}

