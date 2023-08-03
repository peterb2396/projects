package abm;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Stack;

/**
 * One thread, a "processor" with it's own cache memory and can communicate
 * with global memory (read / write) to it through the bus
 *
 */
public class abmThread extends abm implements Runnable{
	
	//The program counter (Instruction to be next executed)
	private int pc = 0; 
	
	//Stack of return addresses which allows for recursive calls, too
	private Stack<Integer> ra = new Stack<Integer>();
	
	//The stack based CPU for calculations and assignments
	private Stack<Integer> stack = new Stack<Integer>();
	
	//STACK of pointerTables for each scope
	private Stack<HashMap<String, Integer>> pointerTabs = new Stack<HashMap<String, Integer>>();
	
	private HashMap<String, Integer> readPointerTable;

	private HashMap<String, Integer> writePointerTable;
	
	//A list of abandoned address that are ready to be re-used
	private Stack<Stack<Integer>> released_addr = new Stack<Stack<Integer>>();
	
	//A stack of symbol tables containing variable data for each scope
	private Stack<HashMap<Integer, Integer>> symTabs = new Stack<HashMap<Integer, Integer>>();
	
	//Two symbol tables which change during parameter passing / func calls
	private HashMap<Integer, Integer> readSymbolTable, writeSymbolTable;
	
	//Cache tables for local versions of global variables for quick access
	//Does NOT change with scope because it contains global variables!
	private HashMap<String, Integer> cachePointerTable;
	private HashMap<Integer, Integer> cacheSymbolTable;
	
	//Must OVERWRITE the parent process's RAM, because after this process
	//has been created, parent.RAM is now referring to a different file!
	private ArrayList<String> ram = new ArrayList<String>();
	
	//involved in memory address (pointer) reassignment
	private String lvaluePtr;
	private boolean lvalueLock = false;
	
	//designates file output
	private PrintStream stream;
	private String fileName;
	
	//Global Variable table holds states of shared memory
	private HashMap<Integer, Integer> globalVarStates = new HashMap<Integer, Integer>();
	
	//Holds which addresses are dirty
	private HashMap<Integer, Integer> dirtyBits = new HashMap<Integer, Integer>();
	
	private MemBus bus;
	
	@SuppressWarnings("unchecked")
	/**
	 * Construct a processor with shared memory.
	 * @param bus
	 * @param fileName
	 * @param ram
	 * @param stream
	 */
	public abmThread(MemBus bus, String fileName, ArrayList<String> ram, PrintStream stream) {
		// TODO This thread should store RAM locally
		this.ram = new ArrayList<String>();
		this.ram = (ArrayList<String>) ram.clone();
		//Clone it because we don't want to reference the object that was
		//passed because its mutable and will be changed on next instruction!

		this.bus = bus;
		this.stream = stream;
		this.fileName = fileName;
		
		//Create tables for variables in this default scope.
		
		symTabs.push(new HashMap<Integer, Integer>());
		pointerTabs.push(new HashMap<String, Integer>());
		released_addr.push(new Stack<Integer>());
		
		readSymbolTable = writeSymbolTable = symTabs.peek();
		readPointerTable = writePointerTable = pointerTabs.peek();
		
		//Instantiate new maps for the Cache
		cacheSymbolTable = new HashMap<Integer, Integer>();
		cachePointerTable = new HashMap<String, Integer>();
		
	}

	/**
	 * START FUNCTION FOR THE THREAD!
	 * - Start the execution section of the text. The global part is already done!
	 */
	public void run() {
		initializeCache();  //sets all states to invalid and not dirty
		gotoExecution();	//moves program counter to .text
		runProgram();		//interprets the program
		console.println("Program ran successfully! Output stored as "+getFileName().replaceAll("abm", "out"));
		
	}
	
	/**
	 * Jump execution line (pc) to where the .text section is
	 */
	void gotoExecution()
	{
		//First check if .text label is defined. If so, store the memory location.
		pc = 0;
		for (String line: ram)
		{
			String[] args = line.strip().split(" ");
			if (args[0].equals(".text"))
				pc = ram.indexOf(line);    //This is the line to jump to
			
		}
	}
	
	/**
	 * Initializer for the global variables.
	 * We hold a state map of each shared variable to know
	 * whether its cacheline is valid, or to look to memory
	 */
	private void initializeCache()
	{
		for (Integer addr: bus.getSymbolTable().keySet())
		{
			globalVarStates.put(addr, invalid); //all invalid by default
			dirtyBits.put(addr, 0); //none dirty by default
		}
		cachePointerTable = new HashMap<String, Integer>();
		cachePointerTable.putAll(bus.getPointerTable());
		
	}

	/**
	 * Run the Program
	 * 	for each line, analyze the instruction and execute a delegate function
	 * 	to handle the request
	 */
	void runProgram()
	{
		//Runs text section, ignores .data
		String currentLine;
		//Program counter runs until reach last line
		while(pc < ram.size())
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
					throwError(".int must not follow .data!");
				
					break;
				}
				case ":&":
				{
					assignPointer();
					
					break;
				}
				default: //unknown command
				{
					
					throwError("Unknown command: "+arguments[0]);
				}
			}
			pc++;
		}
		
	}
	
	/**
	 * For debugging, display all variables in the scope
	 */
	void displayVariables()
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
	void free(String pointer)
	{
		
		//Determine the address this pointer points to. 
		//	What if another pointer points here? we can't free it!
		int addr = writePointerTable.get(pointer);
		
		//First remove the address and it's value from the symbol table
		writeSymbolTable.remove(writePointerTable.get(pointer));
		
		//Then, remove the pointer from the pointer table.
		writePointerTable.remove(pointer);

		boolean referenced = false;
		for (String ptr: writePointerTable.keySet())
			if (writePointerTable.get(ptr) == addr)
			// There is still a pointer referencing this address!
				referenced = true;
		
		if (! referenced)
		{
			released_addr.peek().push(addr);
		}
			
	}

	/**
	 * If last comparison was true, jump to the specified label
	 * @param label
	 */
	void gotrue(String label)
	{
		//Check condition
		if (stack.pop() == 1)
			gotoLabel(label);
	}
	
	/**
	 * if last comparison was false, jump to the specified label
	 * @param label
	 */
	void gofalse(String label)
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
	void endPassing()
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
	void returnFromFunc()
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
	void call(String label)
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
	void begin()
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
	void gotoLabel(String label)
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
	synchronized void assign()
	{
		lvalueLock = false; 
		
		int value = stack.pop();
		int address = stack.pop();

		if (isGlobal(address))
		{
			bus.setVar(this, address, value);
			return;
		}
		writeSymbolTable.put(address, value); //writeSymbolTable used for assigning
		//console.println("ASSIGNED "+value+" at address "+address);
	}
	
	/**
	 * The second stack pointer will now point to the address
	 * on the top of the stack!
	 * Pointer Redirection
	 */
	synchronized void assignPointer()
	{
		lvalueLock = false; 
		
		int ptrNewAddress = stack.pop(); 
		stack.pop(); //Address previously pointed to. Used if we wanted to
					 //Change ALL references to this address.
		
		//A global variable CAN NOT point to a local.
		//We can have global pointers point to each other
		//We can have local pointers point to each other
		//We can have local pointers point to a global address
		
		if (!isGlobal(ptrNewAddress) && isGlobal(lvaluePtr))
		{
			throwError("Can not assign a global pointer to a local address!");
		}
		
		
		//set table according to scope
		HashMap<String, Integer> pointerTable;
	
		if (isGlobal(lvaluePtr))
		{
			pointerTable = new HashMap<String, Integer>();
			pointerTable.putAll(abm.GLOBALPointerTable);
		}
		else
			pointerTable = writePointerTable;

		pointerTable.put(lvaluePtr, ptrNewAddress);
	}
	
	/**
	 * The following methods handle operations and comparisons by using the
	 * stack as a postfix CPU model and pushing the result back.
	 */
	
	void notEqual()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 != op2)? 1:0);
	}
	
	void equal()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 == op2)? 1:0);
	}
	
	void less()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 < op2)? 1:0);
	}
	
	void greater()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 > op2)? 1:0);
	}
	
	void lessEqual()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 <= op2)? 1:0);
	}
	
	void greaterEqual()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push((op1 >= op2)? 1:0);
	}
	void bitNOT()
	{
		stack.push((stack.pop() == 0)? 1:0);
	}
	
	void bitOR()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 | op2);
	}
	
	void bitAND()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 & op2);
	}
	
	void modulo()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 % op2);
	}
	void divide()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 / op2);
	}
	
	void multiply()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 * op2);
	}
	
	void minus()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 - op2);
	}
	
	void plus()
	{
		int op2 = stack.pop();
		int op1 = stack.pop();
		stack.push(op1 + op2);
	}
	
	void pop()
	{
		stack.pop();
	}
	
	/**
	 * Print the result on the top of the stack
	 */
	void print()
	{
		stream.println(stack.peek());
	}
	
	/**
	 * Push the given value to the stack (usually for computation or comparison)
	 * @param value
	 */
	void push(int value)
	{
		stack.push(value);
	}
	
	/**
	 * rvalue will initialize or push the given variable's value to the stack.
	 * Can be used to store the value by also using lvalue and an assignment call
	 * @param var
	 * 
	 * First will check if it's global. 
	 * If it's not there, will check if it's local.
	 * 
	 * If neither, create local variable initialized to 0
	 *
	 * if Process tries to read a global variable:
	 * 1) it is in cache as shared or modified
	 * 		add to stack as usual, change nothing
	 * 
	 * 2) it is in cache as invalid: (not in cache)
	 *
	 * 	(synchronized) search all cores' cache for shared or
	 * 	modified tag. 
	 * 		If it was modified, change to shared and send data.
	 * 		requesting process will update this value as shared
	 * 
	 * 		If no cores have modified or shared tag, read from
	 * 		main memory and update requesting process to shared
	 * 
	 * Process tries to write a global variable:
	 * 1) My cacheline is modified and dirty, all others become invalid
	 * 	  Subsequent read will cause a write back to memory
	 * 
	 */
	synchronized void rvalue(String var) 
	{
		if (isGlobal(var))
		{
			int address = bus.getPointerTable().get(var);
			if (globalVarStates.get(address) == invalid)
			{	//console.println((pc+1)+": invalid var: "+var+" at addr "+address);
				//invalid, so I obtain the variable through the bus
				bus.getVar(this, var);
			}
			
			//We can just read the value from cache, it is valid!
			int value = cacheSymbolTable.get(cachePointerTable.get(var));
			stack.push(value);
			
			return;
		}
		
		
		//Variable is local, or is being created locally.
		if (! readPointerTable.containsKey(var))
		{
			
			if (released_addr.peek().size() == 0)
				// Initialize the pointer to a new address
				readPointerTable.put(var, (readPointerTable.size() + abm.GLOBALPointerTable.size())); 
			else
				//Use the last released address.
				readPointerTable.put(var, released_addr.peek().pop());
			
			//Next initialize the value to 0 at this address, it's null now.
			readSymbolTable.put(readPointerTable.get(var), 0); //ADDRESS <- 0
		}
		
		//add the value to the stack
		stack.push(readSymbolTable.get(readPointerTable.get(var)));
	}

	/**
	 * lvalue will add the given variable name to the symbol table if it does
	 * not already exist. Subsequent assignment calls will assign the value
	 * on the stack, the rvalue, to this address and can be referenced by the
	 * given var (name).
	 * @param var
	 */
	synchronized void lvalue(String var)
	{
		if (isGlobal(var))
		{
			//Place the global variable's address on the stack
			stack.push(cachePointerTable.get(var));
		}
		
		else //local
		{
			if (! writePointerTable.containsKey(var)) //must add this variable to the table
			{
				if (released_addr.peek().size() == 0)
					// Initialize the pointer to a new address
					writePointerTable.put(var, (writePointerTable.size() + abm.GLOBALPointerTable.size())); 
				else
					//Use the last released address.
					writePointerTable.put(var, released_addr.peek().pop());
					
				
				writeSymbolTable.put(writePointerTable.get(var), 0); //link location to value, init 0
			}
			
			stack.push(writePointerTable.get(var));
		}
		
		if (!lvalueLock)
		{
			lvaluePtr = var;
			lvalueLock = true;
		}
	}
	
	/**
	 * Will display the given line of code, not including the 'show' instruction
	 * @param line
	 */
	void show(String line)
	{
		if (line.equals("show"))
			stream.println("");
		else stream.println(line.replaceAll("show ", ""));
		
	}
	
	
	//Helper Functions
	/**
	 * will display the error and the line it occurred on, 
	 * then terminate the program
	 * @param error
	 */
	void throwError(String error)
	{
		//Print error to console and to file
		console.println("Error on line "+ (pc+1) +" of "+fileName+": "  + error);
		stream.println("Error on line "+ (pc+1) +": " + error);
		System.exit(pc);
		
	}
	
	@SuppressWarnings("unused")
	/**
	 * Verifies integer to avoid errors in computation
	 * @param strNum
	 * @return whether or not the value was an integer
	 */
	boolean isNumeric(String strNum) {

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
	void verifyOpSyntax(int argc)
	{
		if (argc > 1)
			throwError("operations must not have any extra arguments!");
		if (stack.size() < 2)
			throwError("operations require at least two operands on the stack");
	}
	
	
	// ** Functions which are not internal, but called between threads
	// ** should be synchronous to allow entry one at a time
	// ** when they handle shared data, like through the bus.
	/**
	 * Helper function determines if a given variable is global
	 * This is because local / global variables are handled different
	 * @param id - variable name
	 * @return true if global
	 */
	synchronized boolean isGlobal(String id)
	{
		//console.println(bus.getPointerTable().containsKey(id));
		if (bus.getPointerTable().containsKey(id))
		{
			return isGlobal(bus.getPointerTable().get(id));
		}
		return false;
		
	}
	
	/**
	 * Is this address global? 
	 * Global addresses are unique from local addresses.
	 * Checks the shared symbol table from the bus.
	 * @param address
	 * @return
	 */
	synchronized boolean isGlobal(int address)
	{
		//Can NOT have duplicate addresses 0-2 global, 3+ local etc
		return bus.getSymbolTable().containsKey(address);
	}
	
	/**
	 * The following are synchronized get methods.
	 */
	synchronized HashMap<String, Integer> getCachePointerTable()
	{
		return cachePointerTable;
	}
	
	synchronized HashMap<Integer, Integer> getCacheSymbolTable()
	{
		return cacheSymbolTable;
	}
	
	synchronized HashMap<Integer, Integer> getStateMachine()
	{
		return globalVarStates;
	}
	
	synchronized HashMap<Integer, Integer> getDirtyBits()
	{
		return dirtyBits;
	}

	synchronized String getFileName() {
		return fileName;
	}


}
