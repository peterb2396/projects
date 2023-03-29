//
//  Person.cpp
//  PeopleDatabase
//
//  Created by Peter Buonaiuto on 10/5/21.
//

#include <string>
#include <stdio.h>
#include <iostream>
class Person{
    
    
private:
    std::string name;
    std::string birthday;
    
public:
    //Construct a person given a name and birthday
    Person(std::string newName, std::string newBirthday)
    {
        name = newName;
        birthday = newBirthday;
    }
    //Retrieve name or bday
    std::string getName(){return name;}
    std::string getBirthday(){return birthday;}
    
    //Set name or bday in class
    void setName(std::string newName){name = newName;}
    void setBirthday(std::string newBirthday){birthday = newBirthday;}
    
    //Return string representation of the member with their name and bday
    std::string toString(){
        return name+", born "+ birthday;
        
    }
    
    //Overloaded comparisons
    bool operator<(const Person &other) const
    {
        long split = name.find(" ");
        long other_split = other.name.find(" ");
        //Will compare based on last name if they have one, or compare first name otherwise
        return (name.substr(split+1).compare(other.name.substr(other_split+1)) < 0);
    }
    
    bool operator>(const Person& other) const
    {
        long split = name.find(" ");
        long other_split = other.name.find(" ");
        //Will compare based on last name if they have one, or compare first name otherwise
        return (name.substr(split+1).compare(other.name.substr(other_split+1)) > 0);
    }
    
    bool operator==(const Person& other) const
    {
        return ((name.compare(other.name) == 0) && (birthday.compare(other.birthday)== 0));
    }
    
    bool operator !=(const Person& other) const
    {
        return !operator==(other);
    }
};
