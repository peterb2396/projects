package abm;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;
import java.util.Stack;



/**
 * An abstract machine created to run any file in the 
 * specified .abm language
 * @author peter
 *
 */
public class abm {
	//FOR EACH PROGRAM
		// Look for a .data section
		// If it exists, run it until .text
		// 		for each program (again)
		//	Create a thread that starts execution at .text if it exists
	
	//Stores the program execution instructions
	static ArrayList<String> ram = new ArrayList<String>();
	
	//The path of the program file to execute
	static String path;
	
	//The program counter (Instruction to be next executed)
	static int pc; 
	
	//Stack of return addresses which allows for recursive calls, too
	static Stack<Integer> ra = new Stack<Integer>();
	
	//The stack based CPU for calculations and assignments
	static Stack<Integer> stack = new Stack<Integer>();
	
	//A list of variable names and their memory locations NAME :: ADDRESS
	//static HashMap<String, Integer> pointers = new HashMap<String, Integer>();
	
	//STACK of pointerTables for each scope
	static Stack<HashMap<String, Integer>> pointerTabs = new Stack<HashMap<String, Integer>>();
	
	static HashMap<String, Integer> readPointerTable, writePointerTable;
	//A list of abandonned address that are ready to be re-used
	static Stack<Stack<Integer>> released_addr = new Stack<Stack<Integer>>();
	
	//A stack of symbol tables containing variable data for each scope
	static Stack<HashMap<Integer, Integer>> symTabs = new Stack<HashMap<Integer, Integer>>();
	
	//Two symbol tables which change during parameter passing / func calls
	static HashMap<Integer, Integer> readSymbolTable, writeSymbolTable;
	
	//Storing the console so we can print status 
	static PrintStream console = System.out;
	
	//Store program name  to throw error with
	static String currentFile;
	
	
	/**
	 * Main method will:
	 * 1) initialize symbol tables
	 * 2) verify proper arguments
	 * 3) load the instruction file into RAM for processing
	 * 4) call runProgram() which will process each line of the program
	 * @param args
	 * @throws FileNotFoundException
	 * @throws URISyntaxException 
	 */
	public static void main(String[] args) throws FileNotFoundException, URISyntaxException {
		
        
		symTabs.push(new HashMap<Integer, Integer>());
		pointerTabs.push(new HashMap<String, Integer>());
		released_addr.push(new Stack<Integer>());
		
		readSymbolTable = writeSymbolTable = symTabs.peek();
		readPointerTable = writePointerTable = pointerTabs.peek();
	
		
		//First step is to load the program into ram.
		
		
		//First make sure we specified a file. If no arguments given,
		//All .abm files in the directory will be ran and converted.
		
		
		path = abm.class.getProtectionDomain().getCodeSource().
				getLocation().getPath().replaceAll("abm.jar", "");
		path = path.replaceAll("abm-exec", "");
		
		
		if (args.length == 0)
		{ //No argument - run all abm files
			File folder = new File(path);
			for(String file: folder.list())
			{
				if (file.endsWith(".abm"))
					{
						currentFile = file;
						//Custom print stream for .out file:
			        	System.setOut(new PrintStream(new File(file.replaceAll("abm", "out"))));
			        
						path += file;
						loadRAM();
						runProgram();
						console.println("Program ran successfully! Output stored as "+file.replaceAll("abm", "out"));
						
						
						path = path.replaceAll(file, ""); //Reset path to containing folder
					}
			}
			
		}
		else 
		{
			//Execute machine for each code file specified
			for (int a = 0; a < args.length; a++)
			{
				//Ran from console for specific file located in source code dir
				String fileName = args[a];
				path += fileName;
				
				try {
					loadRAM();
				} catch (FileNotFoundException e) {
					console.println("File not found: "+fileName +" from " +path);
					path = path.replaceAll(fileName, "");
					continue;
				}
				//Custom print stream for .out file:
		        System.setOut(new PrintStream(new File(fileName.replaceAll("abm", "out"))));
		        
				//Loaded project to ram. Call the main execution loop
				runProgram();
				console.println("Program ran successfully! Output stored as "+fileName.replaceAll("abm", "out"));
				
				path = path.replaceAll(fileName, "");
			}
			
		}
		
	}
	
	/**
	 * Loads file content into RAM array
	 * @throws FileNotFoundException
	 */
	static void loadRAM() throws FileNotFoundException {
		ram.clear(); //clear previous programs from ram
		
		File program = new File(path);
		Scanner sc = new Scanner(program);

		while (sc.hasNextLine())//Insert each line of code
			ram.add(sc.nextLine());
		sc.close();
	}
	
	/**
	 * Run the Program
	 * 	for each line, analyze the instruction and execute a delegate function
	 * 	to handle the request
	 */
	static void runProgram()
	{
		String currentLine;
		//Program counter runs until reach last line
		for(pc = 0; pc < ram.size(); pc++)
		{
			currentLine = ram.get(pc);
			
			//Get arguments of line of code, removing indents
			String[] arguments = currentLine.strip().split(" ");
			int argc = arguments.length;
			
			switch(arguments[0])
			{
				case "show":
				{
					show(currentLine);
					break;
				}
				case "rvalue":
				{
					if (argc != 2)
						throwError("rvalue must be followed by a single identifier.");
					if (isNumeric(arguments[1]))
						throwError("rvalue variable name must NOT be numeric.");
					rvalue(arguments[1]);
					
					break;
				}
				case "lvalue":
				{
					if (argc != 2)
						throwError("lvalue must be followed by a single identifier.");
					if (isNumeric(arguments[1]))
						throwError("lvalue variable name must NOT be numeric.");
					lvalue(arguments[1]);
					
					break;
				}
				case "push":
				{
					if (argc !=2)
						throwError("push must be followed by a single integer.");
					if (! isNumeric(arguments[1]))
						throwError("push argument MUST be an integer!");
					
					push(Integer.parseInt(arguments[1]));
					break;
				}
				case "print":
				{
					if (argc > 1)
						throwError("print must not have any extra arguments!");
					if (stack.isEmpty())
						throwError("can not print while the stack is empty");
					print();
					
					break;
				}
				case "pop":
				{
					if (argc > 1)
						throwError("pop must not have any extra arguments!");
					pop();
					
					break;
				}
				case "+":
				{
					verifyOpSyntax(argc);
					plus();
					
					break;
				}
				case "-":
				{
					verifyOpSyntax(argc);
					minus();
					
					break;
				}
				case "*":
				{
					verifyOpSyntax(argc);
					multiply();
					
					break;
				}
				case "/":
				{
					verifyOpSyntax(argc);
					divide();
					
					break;
				}
				case "div":
				{
					verifyOpSyntax(argc);
					modulo();
					
					break;
				}
				case "&":
				{
					verifyOpSyntax(argc);
					bitAND();
					
					break;
				}
				case "|":
				{
					verifyOpSyntax(argc);
					bitOR();
					
					break;
				}
				case "!":
				{
					if (argc > 1)
						throwError("operations must not have any extra arguments!");
					if (stack.isEmpty())
						throwError("can not compute bitwise compliment because the stack is empty.");
					bitNOT();
					
					break;
				}
				case "<":
				{
					verifyOpSyntax(argc);
					less();
					
					break;
				}
				case ">":
				{
					verifyOpSyntax(argc);
					greater();
					
					break;
				}
				case "<=":
				{
					verifyOpSyntax(argc);
					lessEqual();
					
					break;
				}
				case ">=":
				{
					verifyOpSyntax(argc);
					greaterEqual();
					
					break;
				}
				case "<>":
				{
					verifyOpSyntax(argc);
					notEqual();
					
					break;
				}
				case "=":
				{
					verifyOpSyntax(argc);
					equal();
					
					break;
				}
				case ":=":
				{
					if (stack.isEmpty())
						throwError("Can not assign a value to nothing (stack is empty)");
					assign();
					
					break;
				}
				case "goto":
				{
					if (argc != 2)
						throwError("goto must be followed by a single label");
					gotoLabel(arguments[1]);
					
					break;
				}
				case "halt":
				{
					return;
				}
				case "begin":
				{
					begin();
					break;
				}
				case "call":
				{
					if (argc != 2)
						throwError("call must be followed by a single label");
					
					call(arguments[1]); //call to label of arg 2
					
					break;
				}
				case "return":
				{
					if (argc > 1)
						throwError("return must not contain any arguments!");
					returnFromFunc();
					break;
				}
				case "end":
				{
					endPassing();
					break;
				}
				case "gofalse":
				{
					if (argc != 2)
						throwError("gofalse must be followed by a single label");
					gofalse(arguments[1]);
					break;
				}
				case "gotrue":
				{
					if (argc != 2)
						throwError("gotrue must be followed by a single label");
					gotrue(arguments[1]);
					break;
				}
				case "label":
				{
					//No logic occurs at time of occurrence. 
					//Used when goto is called
					break;
				}
				case "":
				{
					//ignore whitespace lines
					break;
				}
				case "//":
				{
					//ignore comment lines
					break;
				}
				case ".text":
				{
					//Notify text section, where code is
					break;
				}
				case ".data":
				{
					//Notify data section, global variables here
					//This is the section to be read before making threads
					break;
				}
				case ".int":
				{
					//Create global integers
					if (argc < 2)
						throwError(".int must specify at least one global variable name.");
					
					for (String arg: arguments)
					{
						//Create each global int, after the command argument
						if (!arg.equals(".int"))
							makeInt(arg);
						
					}
					
					break;
				}
				case ":&":
				{
					//Stack top is replaced by lvalue below it. Both popped.
					//	Make top point to where bottom points
					//	top ADDRESS must become bottom's address
					//	get top's address. Set bottom's.
					//	previous top -> address 
					
					
					int top = stack.pop();
					int below = stack.pop();
					
					
					//Any pointer which points to this address must be redirected to
					//the new address. So, first get all pointers which point to the old.
					ArrayList<String> outOfDatePointers = new ArrayList<String>();
					
					for (String pointer: writePointerTable.keySet())
					{
						
						if (writePointerTable.get(pointer) == top)
							//This pointer points to the old address and
							//must be reassigned!
						{
							
							outOfDatePointers.add(pointer);
							//console.println("MUST Reassign pointer "+pointer+" to "+below);
							
						}
					}
					
					for (String pointer: outOfDatePointers)
					{
						//If the address this pointer used to point to
						//has no pointers, it will be released.
						free(pointer);
						writePointerTable.put(pointer, below); //assign new address
						//console.println("Reassigned address "+top+" to "+below);
						
						
					}
					outOfDatePointers = null;
					
					break;
				}
				default: //unknown command
				{
					
					throwError("Unknown command: "+arguments[0]);
				}
			}
		}
	}
	
	/**
	 * For debugging, display all variables in the scope
	 */
	static void displayVariables()
	{
		for (String ptr: readPointerTable.keySet())
		{
			int ptr_address = readPointerTable.get(ptr);
			int val = readSymbolTable.get(ptr_address);
			console.println("Variable ("+ ptr_address +"): "+ptr+"      Value: "+val);
		}
	}
	
	/**
	 * Free the given pointer and allow it's memory to be reclaimed
	 * @param pointer
	 */
	static void free(String pointer)
	{
		
		//Determine the address this pointer points to. 
		//	What if another pointer points here? we can't free it!
		int addr = writePointerTable.get(pointer);
		
		//First remove the address and it's value from the symbol table
		writeSymbolTable.remove(writePointerTable.get(pointer));
		
		//Then, remove the pointer from the pointer table.
		writePointerTable.remove(pointer);
		
		//release the memory, IF it isnt referenced by another pointer!
			//We can now check if the old address (top) is referenced by
			//Any other pointers. If not, the memory location can be 
			//released back to available address array to be reused.
		boolean referenced = false;
		for (String ptr: writePointerTable.keySet())
			if (writePointerTable.get(ptr) == addr)
			// There is still a pointer referencing this address!
				referenced = true;
		
		if (! referenced)
		{
			released_addr.peek().push(addr);
			
			//When implementing, make an address array for each scope.
		}
			
	}
	
	static void makeInt(String var)
	{
		//Takes variable name and creates + initializes to 0.
		//executed for each desired global variable
		
		//Same as rvalue, but since it's global, will be visible to all threads and
		//does NOT go on the stack (not for computations, yet).
	
			//Search for the variable. If it exists, DO NOTHING
			//if it does not, make it 0 and add to symbol table
			//Also allocate memory to the pointer.

			
			if (! readPointerTable.containsKey(var))
			{
				//Uses released addresses to save memory.
				if (released_addr.peek().size() == 0)
					// Initialize the pointer to a new address
					readPointerTable.put(var, readPointerTable.size()); 
				else
					//Use the last released address.
					readPointerTable.put(var, released_addr.peek().pop());
				
				
				//Next initialize the value to 0 at this address, it's null now.
				readSymbolTable.put(readPointerTable.get(var), 0); //ADDRESS <- 0
				writeSymbolTable.put(readPointerTable.get(var), 0); //ADDRESS <- 0
			}
			
	}
	/**
	 * If last comparison was true, jump to the specified label
	 * @param label
	 */
	static void gotrue(String label)
	{
		//Check condition
		if (stack.pop() == 1)
			gotoLabel(label);
	}
	
	/**
	 * if last comparison was false, jump to the specified label
	 * @param label
	 */
	static void gofalse(String label)
	{
		//Check condition
		if (stack.pop() == 0)
			gotoLabel(label);
	}
	
	/**
	 * Specifies the end of parameter passing and function call.
	 * Will pop the top symbol table to free local memory owned by the
	 * last function.
	 */
	static void endPassing()
	{
		//Free the local memory owned by the finished function
		symTabs.pop();
		readSymbolTable = writeSymbolTable;
		
		pointerTabs.pop();
		readPointerTable = writePointerTable;
	}
	
	/**
	 * Executed at the end of a function.
	 * Will prepare symbol tables for the "pass back" or return stage,
	 * where from here to 'end' local variables can be passed back to the
	 * main by: 
	 * reading from the new symbol table, & writing to the previous symbol table.
	 */
	static void returnFromFunc()
	{
		//The "pass back" stage
		//read from new, write back to old

		HashMap<Integer, Integer> temp = symTabs.pop();
		writeSymbolTable = symTabs.peek();
		symTabs.push(temp);
		
		HashMap<String, Integer> temp2 = pointerTabs.pop();
		writePointerTable = pointerTabs.peek();
		pointerTabs.push(temp2);
		
		released_addr.pop();
		//return to execution
		pc = ra.pop();
	}
	
	/**
	 * Prepares to call a function.
	 * We will read and write now to the new symbol table. This keeps
	 * variables local, not affecting previous values. 
	 * 
	 * Then, we add the return address to the stack and jump to the given label
	 * @param label
	 */
	static void call(String label)
	{
		//read and write to the new symbol table (local pointers)
		readSymbolTable = writeSymbolTable;
		readPointerTable = writePointerTable;
		
		//New address relief stack
		released_addr.push(new Stack<Integer>());
		
		//Store the return address for when function completes
		ra.push(pc);
		
		gotoLabel(label);          //jump to the function
	}
	
	/**
	 * Marks start of parameter passing by creating a new, local symbol table
	 * and the machine will read from the old table (our existing variables) 
	 * and write to the new table (our local variables).
	 */
	static void begin()
	{
		//Make a new symbol table to pass values 
		//(reads from old, writes to new)
		symTabs.push(new HashMap<Integer, Integer>());
		writeSymbolTable = symTabs.peek();
		
		pointerTabs.push(new HashMap<String, Integer>());
		writePointerTable = pointerTabs.peek();
	}
	
	/**
	 * Jump to the given label.
	 * 	Searches the code for the label, and jumps or handles errors.
	 * @param label
	 */
	static void gotoLabel(String label)
	{
		//First check if label is defined. If so, store the memory location.
		int location = -1;
		for (String line: ram)
		{
			String[] args = line.strip().split(" ");
			if (args[0].equals("label"))
			{
				if (args.length == 1)
					throwError("Discovered label without argument on line "+ (ram.indexOf(line) + 1));
				if (args[1].equals(label))
					location = ram.indexOf(line);    //This is the line to jump to
			}
		}
		if (location == -1)
			throwError("No matching label found to goto!");
		//Jump to the line
		pc = location;
	}
	
	/**
	 * Assigns the topmost stack value to the address specified by the second-top 
	   value on the stack
	 */
	static void assign()
	{
		int value = stack.pop();
		int address = stack.pop();

		//Symbol Table is ADDRESS : VALUE
		writeSymbolTable.put(address, value); //writeSymbolTable used for assigning
		//console.println("ASSIGNED "+value+" at address "+address);
	}
	
	
	
	/**
	 * The following methods handle operations and comparisons by using the
	 * stack as a postfix CPU model and pushing the result back.
	 */
	
	static void notEqual()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 != op2)? 1:0);
	}
	
	static void equal()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 == op2)? 1:0);
	}
	
	static void less()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 < op2)? 1:0);
	}
	
	static void greater()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 > op2)? 1:0);
	}
	
	static void lessEqual()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 <= op2)? 1:0);
	}
	
	static void greaterEqual()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 >= op2)? 1:0);
	}
	static void bitNOT()
	{
		stack.push((stack.pop() == 0)? 1:0);
	}
	
	static void bitOR()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 | op2);
	}
	
	static void bitAND()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 & op2);
	}
	
	static void modulo()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 % op2);
	}
	static void divide()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 / op2);
	}
	
	static void multiply()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 * op2);
	}
	
	static void minus()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 - op2);
	}
	
	static void plus()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 + op2);
	}
	
	static void pop()
	{
		stack.pop();
	}
	
	/**
	 * Print the result on the top of the stack
	 */
	static void print()
	{
		System.out.println(stack.peek());
	}
	
	/**
	 * Push the given value to the stack (usually for computation or comparison)
	 * @param value
	 */
	static void push(int value)
	{
		stack.push(value);
	}
	
	/**
	 * rvalue will initialize or push the given variable's value to the stack.
	 * Can be used to store the value by also using lvalue and an assignment call
	 * @param var
	 */
	static void rvalue(String var) 
	{
		//Search for the variable. If it exists, store its value. 
		//if it does not, make it 0 and add to symbol table
		//MAY NEED TO MAKE A READ / WRITE POINTER TABLE
		
		//MEM ADDRESS to variable value: writeSymbolTable.get(ADDRESS)
		
		//Pointer name to address: pointers.get(ptr_name)
		
		
		// Pointers is NAME :: ADDRESS
		// SymTab is ADDRESS :: VALUE
		
		//Previous scope had it defined, but this scope does not. So we should check
		//For existence in the local pointer table
		if (! readPointerTable.containsKey(var))
		{
			if (released_addr.peek().size() == 0)
				// Initialize the pointer to a new address
				readPointerTable.put(var, readPointerTable.size()); 
			else
				//Use the last released address.
				readPointerTable.put(var, released_addr.peek().pop());
			
			//Next initialize the value to 0 at this address, it's null now.
			readSymbolTable.put(readPointerTable.get(var), 0); //ADDRESS <- 0
		}
		
		
		stack.push(readSymbolTable.get(readPointerTable.get(var)));
	}
	

	/**
	 * lvalue will add the given variable name to the symbol table if it does
	 * not already exist. Subsequent assignment calls will assign the value
	 * on the stack, the rvalue, to this address and can be referenced by the
	 * given var (name).
	 * @param var
	 */
	static void lvalue(String var)
	{
		
		if (! writePointerTable.containsKey(var)) //must add this variable to the table
		{
			if (released_addr.peek().size() == 0)
				// Initialize the pointer to a new address
				writePointerTable.put(var, writePointerTable.size()); 
			else
				//Use the last released address.
				writePointerTable.put(var, released_addr.peek().pop());
				
			
			writeSymbolTable.put(writePointerTable.get(var), 0); //link location to value, init 0
		}
		stack.push(writePointerTable.get(var));
		//put memory address of var on the stack
			
			//Mem address to variable value: writeSymbolTable.get(ADDRESS)
			// Vars is NAME :: ADDRESS
			// SymTab is ADDRESS :: VALUE
	}
	
	/**
	 * Will display the given line of code, not including the 'show' instruction
	 * @param line
	 */
	static void show(String line)
	{
		if (line.equals("show"))
			System.out.println("");
		else System.out.println(line.replaceAll("show ", ""));
	}
	
	
	//Helper Functions
	/**
	 * will display the error and the line it occurred on, 
	 * then terminate the program
	 * @param error
	 */
	static void throwError(String error)
	{
		//Print error to console and to file
		console.println("Error on line "+ (pc+1) +" of "+currentFile+": "  + error);
		System.out.println("Error on line "+ (pc+1) +": " + error);
		System.exit(pc);
		
	}
	
	@SuppressWarnings("unused")
	/**
	 * Verifies integer to avoid errors in computation
	 * @param strNum
	 * @return whether or not the value was an integer
	 */
	static boolean isNumeric(String strNum) {

	    try {
	        int i = Integer.parseInt(strNum);
	    } catch (NumberFormatException nfe) {
	        return false;
	    }
	    return true;
	}
	
	/**
	 * Throws an error if we try to operate without valid operands or arguments
	 * @param argc
	 */
	static void verifyOpSyntax(int argc)
	{
		if (argc > 1)
			throwError("operations must not have any extra arguments!");
		if (stack.size() < 2)
			throwError("operations require at least two operands on the stack");
	}

}
