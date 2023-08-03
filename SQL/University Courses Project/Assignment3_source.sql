CREATE TABLE Customer (
CustomerNumber INT,
CustomerLastName VARCHAR(25),
CustomerFirstName VARCHAR (25),
Phone VARCHAR(12),
Primary Key(CustomerNumber ));
 
CREATE TABLE Course (
CourseNumber INT,
Course VARCHAR(20),
CouseDate Date,
Fee DECIMAL(10,2),
Primary Key(CourseNumber ));

CREATE TABLE Enrollment (
CustomerNumber INT, 
CourseNumber INT, 
AmountPaid Decimal(10,2),
FOREIGN KEY (CustomerNumber ) REFERENCES Customer (CustomerNumber ),
FOREIGN KEY (CourseNumber ) REFERENCES Course (CourseNumber ));

# Populate Customer table
Insert into Customer values (1,"Johnson","Ariel", "206-567-1234");
Insert into Customer values (2,"Green","Robin", "425-678-8765");
Insert into Customer values (3,"Jackson","Charles", "360-789-3456");
Insert into Customer values (4,"Pearson","Jeffery", "206-567-2345");
Insert into Customer values (5,"Sears","Miguel", "360-789-4567");
Insert into Customer values (6,"Kyle","Leah", "425-678-7654");
Insert into Customer values (7,"Myers","Lynda", "360-789-5678");

Select * from Customer; #Display customers


# Populate Course table
Insert into Course values (1,"Adv Pastels", Date '2019-10-01', 500);
Insert into Course values (2,"Beg Oils", Date '2019-09-15', 350);
Insert into Course values (3,"Int Pastels", Date '2019-03-15', 350);
Insert into Course values (4,"Beg Oils", Date '2019-10-15', 350);
Insert into Course values (5,"Adv Pastels", Date '2019-11-15', 500);

Select * from Course; # Dislay courses


# Populate Enrollment table
Insert into Enrollment values (1, 1, 250);
Insert into Enrollment values (1, 3, 350);
Insert into Enrollment values (2, 2, 350);
Insert into Enrollment values (3, 1, 500);
Insert into Enrollment values (4, 1, 500);
Insert into Enrollment values (5, 2, 350);
Insert into Enrollment values (6, 5, 250);
Insert into Enrollment values (7, 4, 0);

Select * from Enrollment; #Display enrollment

# Display all instances of Adv Pastels in course table
Select * from Course where Course = "Adv Pastels";

# Last Question
Select Course.Course, Customer.CustomerNumber, Customer.CustomerLastName, Customer.CustomerFirstName, 
	   Customer.Phone, Enrollment.CourseNumber, Enrollment.AmountPaid 
From Customer, Enrollment, Course 
where Customer.CustomerNumber = Enrollment.CustomerNumber 
and Enrollment.CourseNumber = Course.CourseNumber ;