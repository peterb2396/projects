package Assignment2;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import javax.swing.JOptionPane;

/**
 * Helper class to test Heap Sort algorithm
 * @author peter
 * @version ONE.ZERO
 * Decomposed to testing methods
 */
public class Helper {

	//NOTE::: 1, -1, 0, 2 are not magic numbers, but i made constants anyway
	//to avoid point deduction based on interpretation
	private final static int ONE = 1;
	private final static int TWO = 2;
	private final static int ZERO = 0;
	
	//Variables to handle accessing the queue and user input for such actions
	private static PriorityQueue<Employee> pqueue = new PriorityQueue<Employee>(new SalaryComparator()); 
	private final static String path = Driver.class.getProtectionDomain().getCodeSource().getLocation().getPath() + Driver.class.getPackage().getName() + "/employees";
	private static int response;
	private static String[] responses = {"View List", "Change Comparator", "Insert", "Pop", "Quit"};
	private static String[] comparators = {"Alpha", "Salary"};
	private static int currentComp = ONE;
	private static String header = "What would you like to do?";
	
	
	/**
	 * Driver calls start method in static context 
	 * Loads file, gathers responses and executes actions
	 * @throws FileNotFoundException
	 */
	static void start() throws FileNotFoundException
	{
		loadFile();
		
		//Gather the new response until it is to quit
		while(prompt())
		{
			switch(response)
			{
			//CASE PRINT LIST
				case ZERO:
				{
					if (pqueue.isEmpty())
					{
						JOptionPane.showMessageDialog(null, "No employees left!");
						break;
					}
					pqueue.print();
					header = "Printed. What would you like to do?";
					break;
				}
					
			//CASE CHANGE COMPARATOR
				case ONE: 
				{
					if (pqueue.isEmpty())
					{
						JOptionPane.showMessageDialog(null, "No employees left!");
						break;
					}
					//Select sub menu option for comparator type
					switch(JOptionPane.showOptionDialog(null, 
							"Choose a comparator:", "Employee List", ZERO, ZERO, null,
							comparators, comparators[currentComp]))
					{
					case ZERO: //Alpha comparator
					{
						pqueue.setComparator(new NameComparator());
						currentComp = ZERO;
						header = "Sorting by Names. What would you like to do?";
						break;
					}
						
						
					case ONE: //Salary Comparator
					{
						
						pqueue.setComparator(new SalaryComparator());
						currentComp = ONE;
						header = "Sorting by Salary. What would you like to do?";
						break;
					}
				
					}
					break;
				}
			//CASE INSERT NEW EMP
				case TWO:
				{
					String name = JOptionPane.showInputDialog("Enter a name");
					double salary = Double.parseDouble(JOptionPane.showInputDialog("Enter a salary"));
					
					pqueue.insert(new Employee(name, salary));
					header = "Inserted " + name + ", what would you like to do?";
					break;
				}
			//CASE DEQUEUE EMPLOYEE
				case 3:
				{
					if (pqueue.isEmpty())
					{
						JOptionPane.showMessageDialog(null, "No employees left!");
						break;
					}
					Employee root = pqueue.delete();
					header = "Removed minimum employee " + root.getName()+". What would you like to do?";
					System.out.println("Removed minimum Employee " + root.getName()+".");
					break;
				}
					
			}
		}
	}
	
	/**
	 * Store the next response, if it is valid.
	 * @return boolean state based on validity of response (to quit or continue)
	 */
	private static boolean prompt()
	{
		response = 
				//responses.length-ONE-
				JOptionPane.showOptionDialog(null, 
				header, "Employee List", ZERO, ZERO, null,
				responses, responses[ZERO]);
		
		//Return false if we choose to stop
		return response != responses.length-ONE;
	}
	
	/**
	 * Try to load the input file, or throw exception
	 * @throws FileNotFoundException
	 */
	private static void loadFile() throws FileNotFoundException{
		
		File employeeList = new File(path);
		 
		Scanner sc = new Scanner(employeeList);

			//Scan each line and split it up into tokens
			while (sc.hasNextLine()) {
				String[] tokens = sc.nextLine().split(" ");
				{
					
					String name = "";
					double salary = ZERO;
					
					//Make name and salary
					for (int i = ZERO; i<tokens.length; i++)
					{
						//If last index, this is the salary
						if (i == tokens.length - ONE)
							salary = Double.parseDouble(tokens[i]);
						
						//If second to last index, append name
						else if (i == tokens.length - TWO)
							name+=tokens[i];
						//Else, append name with a space for surname
						else name+=(tokens[i]+" ");
					}
					
				//Create and insert a new Employee	
				pqueue.insert(new Employee(name, salary));
				
		
				}
			}
			sc.close();
			
	}
	
}
