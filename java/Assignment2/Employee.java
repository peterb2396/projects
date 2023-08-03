package Assignment2;

import java.util.Comparator;
/**
 * Employee for testing
 * @author peter
 *
 */
public class Employee {

	private double salary;
	private String name;
	
	/**
	 * Takes a name and salary and constructs a new Employee
	 * @param name
	 * @param salary
	 */
	
	public Employee(String name, double salary)
	
	{	
		//Set name
		this.name = name;
		
		//Set salary
		this.salary = salary;
	}
	
	/**
	 * Override print method for displaying Employee
	 * @return String representation of Employee object
	 */
	public String toString()
	{
		return name + " makes $"+ salary;
		
	}
	
	/**
	 * Get salary
	 * @return The Employee salary as a double
	 */
	public double getSalary()
	{
		return salary;
	}
	
	/**
	 * Get Name
	 * @return Employee name as String
	 */
	public String getName()
	{
		return name;
	}


}

/**
 * Class for comparing salaries
 * @author peter
 * @implNote implements Comparator
 */
class SalaryComparator implements Comparator<Employee>
{
	@Override
	public int compare(Employee e1, Employee e2) {
		//System.out.println("COMPARING SALARY");
		// TODO Compare based on salary
		if (e1.getSalary() > e2.getSalary())
		{
			return 1;
		}
			
		
		if (e1.getSalary() < e2.getSalary())
			return -1;
		//Same salary, so compare alphabetically now
		return e1.getName().compareTo(e2.getName());
	}
}

/**
 * Class for comparing names
 * @author peter
 * @implNote implements Comparator
 */
class NameComparator implements Comparator<Employee>
{

	@Override
	public int compare(Employee e1, Employee e2) {
		//System.out.println("COMPARING NAME");
		// TODO Compare based on name - if same name, compare salaries
		
		//If the names are different, compare them
		if (e1.getName().compareTo(e2.getName()) != 0)
			return e1.getName().compareTo(e2.getName());
		
		//If the names are the same, compare their salary
		if (e1.getSalary() > e2.getSalary())
			return 1;
		
		if (e1.getSalary() < e2.getSalary())
			return -1;
		
		//Same name AND same salary, just return 0 because they're identical
		return 0;
	}
	
}
