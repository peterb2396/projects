package abm;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Abstract Machine v3.1
 * @author peter
 *
 *	Interprets any program written in the specified .abm language.
 *
 *	For each source code file, shared (global) variables will be
 *	initialized and stored in shared memory. Each program will then be
 *	ran in parallel on it's own thread. Communication between cores will
 *	be done by means of a memory bus according to the MSI protocol for
 *	cacheline access. 
 *
 *	Each core has it's own cache which is broken up into two levels.
 *	One cache contains local-only variables only accessible to the 
 *	owning process. The other cache is reserved for shared variables.
 *	When requesting a shared variable, the requesting process will first
 *	look to other caches and try to share it's value, if it's valid.
 *	
 *	According to the MSI protocol, the demanding process will only read a
 *	shared value from memory if necessary, as it's expensive. Cores will
 *	keep their own versions of shared memory until their updates are
 *	requested by another core, in which case the appropriate promotion
 *	or demotion of state according to the MSI State Machine will occur.
 *
 *	After a core posts a write to the Memory Bus, all other cores will
 *	be notified to invalidate their copy of this data in their cacheline.
 *	When a core posts a read, the bus will provide the most efficient route
 *	to the valid info, hopefully in a cacheline.
 *
 *	After a modification to a shared value, it will set the dirty bit so
 *	that subsequent reads to this data will force the value to be written
 *	through to memory to post changes to the shared variable.
 */
public class abm {

	//Stores the program execution instructions
	private static ArrayList<String> current_program = new ArrayList<String>();
	
	//The path of the program file to execute
	static String path;
	
	//Storing the console so we can print status 
	static public PrintStream console = System.out;
	
	// Program counter used for parsing the data section.
	static private int pc_data = 0; 
	
	
	/** GLOBAL POINTER TABLE (POINTER - > ADDRESS) **/
	static ConcurrentHashMap<String, Integer> GLOBALPointerTable;
	
	/** GLOBAL SYMBOL TABLE (ADDRESS -> VALUE) **/
	static ConcurrentHashMap<Integer, Integer> GLOBALSymbolTable;
	
	
	static final int modified = 2;
	static final int shared = 1;
	static final int invalid = 0;
	
	
	/**
	 * Main method will:
	 * 1) initialize global tables
	 * 2) verify proper arguments
	 * 3) load the instruction file into RAM for processing
	 * 4) call initGlobalVariables() which will process each line of the data section
	 * @param args
	 * @throws FileNotFoundException
	 * @throws URISyntaxException 
	 */
	public static void main(String[] args) throws FileNotFoundException, URISyntaxException {
		
	//Create the global tables, visible / accessible to all threads
	GLOBALSymbolTable = new ConcurrentHashMap<Integer, Integer>();
	GLOBALPointerTable = new ConcurrentHashMap<String, Integer>();

	
	// Initialize global variables for all desired files.
	// For each file, load into RAM and send ram to a new thread.
	
	path = abm.class.getProtectionDomain().getCodeSource().
			getLocation().getPath().replaceAll("abm.jar", "");
	path = path.replaceAll("abm-exec", "");
	
	//Create a bus which will communicate between cores
	MemBus bus = new MemBus();
	
	
	if (args.length == 0)
	{ //No argument - run all abm files
		File folder = new File(path);
		for(String file: folder.list()) //run data sections
		{
			if (file.endsWith(".abm"))
			{
		        System.setOut(makeStream(file));
		        
				path += file;
				loadRAM();
				initGlobalVariables(file);
				
				path = path.replaceAll(file, ""); //Reset path to containing folder
			}
		}
		//Here, all global variables have been initialized.
		
		//run TEXT sections - the real program!
		for(String file: folder.list())
		{
			if (file.endsWith(".abm"))
			{
		        System.setOut(makeStream(file));
		        
				path += file;
				loadRAM();
				abmThread core = new abmThread(bus, file, current_program, makeStream(file));
				Thread process = new Thread(core);
					
				bus.cores.add(core);
			    process.start();
					
				path = path.replaceAll(file, ""); //Reset path to containing folder
			}
		}
		
	}
	else //Not running every file...
	{
		String file;
		//Execute machine for each code file specified
		for (int a = 0; a < args.length; a++)
		{
			//Ran from console for specific file located in source code dir
			file = args[a];
			path += file;
			
			try {
				loadRAM();
			} catch (FileNotFoundException e) {
				console.println("File not found: "+file +" from " +path);
				path = path.replaceAll(file, "");
				continue;
			}
			//Custom print stream for .out file:
	        System.setOut(makeStream(file));
	        
			//Loaded project to ram. Call the main execution loop for DATA values
			initGlobalVariables(file);
			
			path = path.replaceAll(file, "");
		}
		
		//EXECUTE TEXT SECTION IN A NEW THREAD
		for (int a = 0; a < args.length; a++)
		{
			//Ran from console for specific file located in source code dir
			file = args[a];
			path += file;
			
			try {
				loadRAM();
			} catch (FileNotFoundException e) {
				//User already notified of error in last block.
				path = path.replaceAll(file, "");
				continue;
			}
			//Custom print stream for .out file:
	        System.setOut(makeStream(file));
	        
			//Loaded project to ram. Call the main execution loop for DATA values
	        Thread process = new Thread(new abmThread(bus, file, current_program, makeStream(file)));
	        process.start();
			
			path = path.replaceAll(file, "");
		}
		
	}
		
	}
	
	/**
	 * Loads file content into RAM array
	 * @throws FileNotFoundException
	 */
	static void loadRAM() throws FileNotFoundException {
		current_program.clear(); //clear previous program from ram
		
		File program = new File(path);
		Scanner sc = new Scanner(program);

		while (sc.hasNextLine())//Insert each line of code
			current_program.add(sc.nextLine());
		sc.close();
	}

	/**
	 * Initialize all shared variables
	 * @param file name
	 */
	private static void initGlobalVariables(String file)
	{
		boolean dataSection = false;
		int location = 0;
		for (String line: current_program)
		{
			String[] args = line.strip().split(" ");
			if (args[0].equals(".data"))
			{
				location = current_program.indexOf(line);    //This is the line to jump to
				dataSection = true;
			}
			
		}
		//Jump to the line of .data, or beginning if no shared variables
		pc_data = location;
		
		
		//Runs only .data, stops at .text
		String currentLine;
		//Program counter runs until reach last line
		while (dataSection)
		{
			currentLine = current_program.get(pc_data);
			
			//Get arguments of line of code, removing indents
			String[] arguments = currentLine.strip().split(" ");
			int argc = arguments.length;
			
			switch(arguments[0])
			{
			case ".text":
			{
				//data section is over!
				dataSection = false;
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
				{
					throwInitError(".int must be followed by at least one global variable identifier!", file);
				}
					
				for (String arg: arguments)
				{
					//Create each global int, after the command argument
					if (!arg.equals(".int"))
						makeInt(arg);
					
				}
				
				break;
			}
			default:
			{
				
			}
			}
			pc_data++;
		}
	}
	
	//Helper Functions
	/**
	 * will display the error and the line it occurred on, 
	 * then terminate the program
	 * @param error
	 */
	static void throwInitError(String error, String file)
	{
		//Print error to console and to file
		console.println("Error on line "+ (pc_data+1) +" of "+file+": "  + error);
		System.out.println("Error on line "+ (pc_data+1) +": " + error);
		System.exit(pc_data);
		
	}
	
	/**
	 * Tries to store output in the output folder.
	 * If it doesn't exist, output will be thrown into the current dir.
	 * @return PrintStream to set as output
	 */
	static PrintStream makeStream(String file)
	{
		PrintStream stream = null;
		try
		{
			stream = new PrintStream(new File("Output/"+file.replaceAll("abm", "out")));
		}
		//No output folder exists! Throw it in the current directory
		catch (FileNotFoundException e)
		{
			try {
				stream = new PrintStream(new File(file.replaceAll("abm", "out")));
			} catch (FileNotFoundException e1) {
				//Impossible, would've caught earlier
			}
		}
		
		return stream;
		
	}
	
	/**
	 * Takes an identifier and creates a global variables
	 * then posts it to the shared symbol table.
	 * @param var
	 */
	static void makeInt(String var)
	{
		if (! GLOBALPointerTable.containsKey(var))
		{
			GLOBALPointerTable.put(var, GLOBALPointerTable.size()); 
		
			//Next initialize the value to 0 at this address, it's null now.
			GLOBALSymbolTable.put(GLOBALPointerTable.get(var), 0); //ADDRESS <- 0
		}
			
	}
}