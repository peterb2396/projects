package abm;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A means of communication between cores, and from a core to memory.
 * Changes to local copies of shared variables must cause a reaction
 * in the state machines of all cores. 
 * @author peter
 *
 */
public class MemBus
{
	//Array of cores
	ArrayList<abmThread> cores = new ArrayList<abmThread>();
	
	/**
	 * Returns the global pointer table
	 * @return HashMap<String, Integer> pointer table
	 */
	synchronized ConcurrentHashMap<String, Integer> getPointerTable()
	{
		return abm.GLOBALPointerTable;
	}
	
	/**
	 * Returns the global symbol table
	 * @return HashMap<Integer, Integer> symbol table
	 */
	synchronized ConcurrentHashMap<Integer, Integer> getSymbolTable()
	{
		return abm.GLOBALSymbolTable;
	}
	
	//I want to get a value from some other core which is M / S
	/**
	 * Obtain the given variable. Already determined to be GLOBAL.
	 * Preferably from another cache
	 * If not in any cache, go to memory.
	 * @param var
	 * @return the value
	 */
	synchronized void getVar(abmThread requestor, String var)
	{
		//What is the address on the global table?
		int address = abm.GLOBALPointerTable.get(var);
		boolean invalidEverywhere = true;
		
		for(abmThread core: cores)
		{
			if (core.getStateMachine().get(address) == abm.modified
					|| core.getStateMachine().get(address) == abm.shared)
			{
				//This core will share it's value with the requester
				
				int value = core.getCacheSymbolTable().get(address);
				requestor.getCacheSymbolTable().put(address, value);
				
				if (core.getStateMachine().get(address) == abm.modified)
				{
					core.getStateMachine().put(address, abm.shared);
					//Am a reading a dirty value? 
					if (core.getDirtyBits().get(address) == 1)
					{
						//This value is dirty, so we write-through
						abm.GLOBALSymbolTable.put(address, value);
						core.getDirtyBits().put(address, 0); //not dirty
					}
				}
					
				
				requestor.getStateMachine().put(address, abm.shared);
				invalidEverywhere = false;
				
				break;
			}
		}	//Were we unable to find a valid version of the variable?
		if (invalidEverywhere)
		{
			//We must find it from memory, set requester to shared
			//Because a PrRd promotes invalid to shared.
			
			int value = abm.GLOBALSymbolTable.get(address);
			requestor.getCacheSymbolTable().put(address, value);
			
			//abm.console.println(requestor.getFileName()+": put "+value+" at addr "+address);

			//State becomes shared because it shares the value with memory
			requestor.getStateMachine().put(address, abm.shared);
		}
		
	}
	
	/**
	 * A core is writing a value
	 * @param requestor
	 * @param var
	 * @param value
	 * 
	 * This core's cacheline must be set to modified. All others invalid.
	 * Modify the cacheline value.
	 * DONT UPDATE MEMORY HERE (don't write-through)
	 * 	memory is only to be updated when a read occurs on this value
	 * 	which will occur since this cacheline now has the dirty bit.
	 */
	synchronized void setVar(abmThread requestor, int address, int value)
	{
		requestor.getCacheSymbolTable().put(address, value);
		requestor.getStateMachine().put(address, abm.modified);
		requestor.getDirtyBits().put(address, 1); //value is now dirty
		
		for (abmThread core: cores)
			if (core != requestor)
				core.getStateMachine().put(address, abm.invalid);
	}
	
}
