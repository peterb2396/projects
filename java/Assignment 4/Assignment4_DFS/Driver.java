package Assignment4;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import javax.swing.ImageIcon;
import javax.swing.JOptionPane;


/**
 * Drives the testing of ADT Graph with DFS iterator.
 * @author peter
 * Uses Helper class
 */
public class Driver {

	/**
	 * Makes static reference to Helper class to start testing
	 * @param args
	 * @throws FileNotFoundException
	 */
	public static void main(String[] args) throws FileNotFoundException {
		Helper.start();
	}
}

/**
 * Tests Graph ADT by optionally using a file to load data.
 * @author peter
 *
 */
class Helper {
	
	//Variables to setup the Menu and file system
	static ImageIcon icon = new ImageIcon(Driver.class.getProtectionDomain().getCodeSource().getLocation().getPath() + Driver.class.getPackage().getName() + "/graph_icon.png");
	static String path = Driver.class.getProtectionDomain().getCodeSource().getLocation().getPath() + Driver.class.getPackage().getName() + "/data.txt";
	static int response;

	static String[] responses = {"Quit", "Swap", "Compare", "Count V/E", "Edge Menu", "Vertex Menu", "Print Graph"};
	static String[] edgeOptions = {"Remove Edge", "Add Edge", "Find Edge", "Find Weight"};
	static String[] vertexOptions = {"Remove Vertex", "Add Vertex", "Find Vertex"};
	static String[] options = {"Yes", "No"};

	//Two graphs are made which can be modified in parallel and compared.
	static String header = "What would you like to do?";
	static Graph graph1 = new Graph(1);
	static Graph graph2 = new Graph(2);
	
	static Graph graph = graph1;
	static int activeGraph = 1;
	
	/**
	 * Begins testing by loading file data and printing the graph made by the data.
	 * Then Displays options for operating on the graphs.
	 * @throws FileNotFoundException
	 */
	public static void start() throws FileNotFoundException
	{

		loadFile(graph);
		loadFile(graph2);
		System.out.println(graph);
	
	
	//Main feedback loop - testoperations until Quit
	while(prompt())//while response is not 0
	{
		switch(response)
		{
		
		case 1: //Swap graphs
		{
			if (activeGraph == 1)
			{
				graph = graph2;
				activeGraph++;
				header = "Swapped to Graph 2. What would you like to do?";
				break;
			}
			graph = graph1;
			activeGraph--;
			header = "Swapped to Graph 1. What would you like to do?";
			break;
		}
		
		case 2: //Compare the current graph to the other graph
		{
			//Does this graph equal the graph that is not active?
			if (graph.equals( (activeGraph == 1)? graph2 : graph1 ))
				//They're equal
				{
					JOptionPane.showMessageDialog(null, "The graphs are equal!");
					break;
				}
				JOptionPane.showMessageDialog(null, "The graphs are NOT equal!");
				break;
			
		}
		
		case 3: //count 
		{
			JOptionPane.showMessageDialog(null, "There are "+ graph.getVertexCount()+
					" vertices and "+graph.getEdgeCount() + " edges.");
			break;
		}
		
		case 4: //edge menu
		{
			int edgeResponse = JOptionPane.showOptionDialog(null, 
					"What would you like to do with the Edges?", 
					"Edge Menu", 0, 0, icon,
					edgeOptions, edgeOptions[edgeOptions.length - 1]);
			switch(edgeResponse)
			{
			
			case 0: //Remove Edge
			{
				String input = JOptionPane.showInputDialog("Enter Vertex 1:");
				while(!isNumeric(input)) //Make sure our response is valid (numeric)
					input = JOptionPane.showInputDialog("Enter Vertex 1:", "Must enter an Integer!");
				
				int value1 = Integer.parseInt(input);
				
				input = JOptionPane.showInputDialog("Enter Vertex 2:");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter Vertex 2:", "Must enter an Integer!");
				
				int value2 = Integer.parseInt(input);
				
					//Make sure the given vertices exist
					if (graph.find(value1) == null && graph.find(value2) == null)
						JOptionPane.showMessageDialog(null, "Neither inputs are valid vertices!");
					
					else if (graph.find(value1) == null)
						JOptionPane.showMessageDialog(null, value1+" is not a valid vertex!");
					
					else if (graph.find(value2) == null)
						JOptionPane.showMessageDialog(null, value2+" is not a valid vertex!");
					else // Both vertices are valid. Is there an edge between them?
						{
							
							if (graph.findEdge(graph.find(value1), graph.find(value2)) == null)
							{
								JOptionPane.showMessageDialog(null, "No edge exists between these vertices!");
								break;
							}
							//Edge exists, remove it
							graph.removeEdge(graph.find(value1), graph.find(value2));
							JOptionPane.showMessageDialog(null, "Edge "+value1+"---"+value2+" was removed!");
						}
				break;
			}
			
			case 1: //Add Edge
			{
				String input = JOptionPane.showInputDialog("Enter Vertex 1:");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter Vertex 1:", "Must enter an Integer!");
				
				int value1 = Integer.parseInt(input);
				
				input = JOptionPane.showInputDialog("Enter Vertex 2:");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter Vertex 2:", "Must enter an Integer!");
				
				int value2 = Integer.parseInt(input);
				
				//Check if the inputs are valid. If so, check if an edge exists. If so, ask to OR.
				if (graph.find(value1) == null && graph.find(value2) == null)
					JOptionPane.showMessageDialog(null, "Neither inputs are valid vertices!");
				
				else if (graph.find(value1) == null)
					JOptionPane.showMessageDialog(null, value1+" is not a valid vertex!");
				
				else if (graph.find(value2) == null)
					JOptionPane.showMessageDialog(null, value2+" is not a valid vertex!");
				else // Both vertices are valid. Is there an edge between them?
					{
						int weight = graph.findWeight(graph.find(value1), graph.find(value2));
						if (weight == -1) //Edge does not yet exist, so lets make one!
						{
							weight = Integer.parseInt(JOptionPane.showInputDialog("Enter a weight for the edge: "));
							graph.makeEdge(value1, value2, weight);
							JOptionPane.showMessageDialog(null, "Edge "+value1+"----"+value2+" was made with weight "+weight);
							header = "Edge "+value1+"----"+value2+" was assigned new weight "+weight;
						}
						else //Edge exists. OR?
						{
							switch(JOptionPane.showOptionDialog(null, 
									"Would you like to override the existing edge?", 
									"An edge here already exists with weight "+weight, 0, 0, null,
									options, options[0]))
							{
							case 0: //Yes, OR
							{
								input = JOptionPane.showInputDialog("Enter a new weight for this edge: ");
								while(!isNumeric(input))
									input = JOptionPane.showInputDialog("Enter a new weight for this edge: ", "Must be an Integer");
								
								weight = Integer.parseInt(input);
								graph.removeEdge(graph.find(value1), graph.find(value2));
								graph.makeEdge(value1, value2, weight);
								JOptionPane.showMessageDialog(null, "Edge "+value1+"----"+value2+" was reassigned weight "+weight);
								header = "Edge "+value1+"----"+value2+" was assigned new weight "+weight;
								break;
							}
							case 1: //No, don't OR
							{
								break;
							}
							}
						}
						break;
					}
			}
			
			case 2: //Find Edge
			{
				String input = JOptionPane.showInputDialog("Enter Vertex 1:");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter Vertex 1:", "Must enter an Integer!");
				
				int value1 = Integer.parseInt(input);
				
				input = JOptionPane.showInputDialog("Enter Vertex 2:");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter Vertex 2:", "Must enter an Integer!");
				
				int value2 = Integer.parseInt(input);
				
					if (graph.find(value1) == null && graph.find(value2) == null)
						JOptionPane.showMessageDialog(null, "Neither inputs are valid vertices!");
					
					else if (graph.find(value1) == null)
						JOptionPane.showMessageDialog(null, value1+" is not a valid vertex!");
					
					else if (graph.find(value2) == null)
						JOptionPane.showMessageDialog(null, value2+" is not a valid vertex!");
					else // Both vertices are valid. Is there an edge between them?
						{
							int weight = graph.findWeight(graph.find(value1), graph.find(value2));
							if (weight == -1)
							{
								JOptionPane.showMessageDialog(null, "No edge exists between these vertices!");
								break;
							}
								
							JOptionPane.showMessageDialog(null, "An edge between "+value1+" and "+value2+" exists!");
						}
				break;
			}
			
			case 3: //Find Weight
			{
				String input = JOptionPane.showInputDialog("Enter value of Vertex 1");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter value of Vertex 1", "Must enter an Integer!");
				int value1 = Integer.parseInt(input);
				
				input = JOptionPane.showInputDialog("Enter value of Vertex 2");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter value of Vertex 2", "Must enter an integer!");
				int value2 = Integer.parseInt(input);
				
					if (graph.find(value1) == null && graph.find(value2) == null)
						JOptionPane.showMessageDialog(null, "Neither inputs are valid vertices!");
					
					else if (graph.find(value1) == null)
						JOptionPane.showMessageDialog(null, value1+" is not a valid vertex!");
					
					else if (graph.find(value2) == null)
						JOptionPane.showMessageDialog(null, value2+" is not a valid vertex!");
					else // Both vertices are valid. Is there an edge between them?
						{
							int weight = graph.findWeight(graph.find(value1), graph.find(value2));
							if (weight == -1)
							{
								JOptionPane.showMessageDialog(null, "No edge exists between these vertices!");
								break;
							}
							
							//There is an edge between the requested vertices. Display its weight.
							JOptionPane.showMessageDialog(null, "The weight between "+value1+" and "+value2+" is "+weight+".");
						}
				break;
			}
			}
			break;
		}
		
		case 5: //vertex menu
		{
			int vtxResponse = JOptionPane.showOptionDialog(null, 
					"What would you like to do with the vertices?", 
					"Vertex Menu", 0, 0, icon,
					vertexOptions, vertexOptions[vertexOptions.length - 1]);
			switch(vtxResponse)
			{
			
			case 0: //Remove Vertex
			{
				String input = JOptionPane.showInputDialog("Enter value of the vertex to remove.");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter value of the vertex to remove.", "Must enter an Integer!");
				
				int value = Integer.parseInt(input);
				Vertex vertex = graph.find(value);
				if (vertex == null)
				{
					JOptionPane.showMessageDialog(null, "Vertex with value "+value+" does not exist!");
					break;
				}
				//Found the vertex. Remove it.
				graph.removeVertex(vertex);
				JOptionPane.showMessageDialog(null, "Removed Vertex with value "+value);
				header = "Removed Vertex with value "+value;
				break;
			}
			
			case 1: //Add Vertex
			{
				String input = JOptionPane.showInputDialog("Enter value of the new vertex:");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter value of the new vertex", "Must enter an Integer!");
				
				int newVertex = Integer.parseInt(input);

				if(graph.addVertex(newVertex) == null)
				{//The vertex already exists
					
					JOptionPane.showMessageDialog(null, "Vertex with value "+newVertex+" already exists!");
					break;
				}
				header = "Added " + newVertex+". What would you like to do?";
				break;
			}
			
			case 2: //Find Vertex
			{
				String input = JOptionPane.showInputDialog("Enter Vertex to search for");
				while(!isNumeric(input))
					input = JOptionPane.showInputDialog("Enter Vertex to search for", "Must enter an Integer!");
				
				int value = Integer.parseInt(input);
				
				Vertex vertex = graph.find(value);
				if (vertex == null)
				{
					JOptionPane.showMessageDialog(null, "Vertex with value "+value+" does not exist!");
					break;
				}
					
				
				//Vertex found: display its info
				JOptionPane.showMessageDialog(null, "Vertex "+value+" was found, and has "+vertex.edges.size()+" edges.");
					
				break;
			}
			
			}
			break;
		}
		
		case 6: //print
		{
			if (graph.getVertexCount() == 0)
			{
				JOptionPane.showMessageDialog(null, "No vertices in the graph!");
				break;
			}
			//Clear old print
			for(int i = 0; i<2; i++)
				System.out.println();
			
			System.out.println(graph);
			header = "Printed. What would you like to do?";
			break;
		}
		
		}
		

	}
}

	/**
	 * Stores the menu response, and decides when to stop asking 
	 * @return boolean of whether the user wants to continue
	 */
	private static boolean prompt() {
		
		response = 
				JOptionPane.showOptionDialog(null, 
				"GRAPH "+activeGraph+": "+header, "ADT Graph "+activeGraph, 0, JOptionPane.INFORMATION_MESSAGE, icon,
				responses, responses[0]);
		
		//Return false if we choose to stop
		return response != 0;
	}
	
	/**
	 * Try to load the input file, or throw exception
	 * @throws FileNotFoundException
	 */
	private static void loadFile(Graph graph) throws FileNotFoundException{
		
		File graphData = new File(path);
		 
		Scanner sc = new Scanner(graphData);

			//Scan each line and split it up into tokens
			while (sc.hasNextLine()) {
				String[] tokens = sc.nextLine().split(" ");
				{
					//Setup vertices / weight for each input line
					int value1 = 0, value2 = 0, weight = 0;
			
					value1 = Integer.parseInt(tokens[0]);
					if (tokens.length > 1)
						value2 = Integer.parseInt(tokens[1]);
					if (tokens.length > 2)
						weight = Integer.parseInt(tokens[2]);
					
					//Options: Add a vertex, an edge, or a weighted edge.
					if (tokens.length == 1)
						graph.addVertex(value1);
					if (tokens.length == 2)
						graph.makeEdge(value1, value2, 0);
					if (tokens.length == 3)
						graph.makeEdge(value1, value2, weight);
				
		
				}
			}
			sc.close();
			
	}
	
	/**
	 * Make sure the typed input is numeric (so we can find a numeric vertex)
	 * @param input
	 * @return boolean representation of whether the input was an integer
	 */
	private static boolean isNumeric(String input) {
	    if (input == null) {
	        return false;
	    }
	    try {
	        @SuppressWarnings("unused")
			Integer n = Integer.parseInt(input);
	    } catch (NumberFormatException nfe) {
	        return false;
	    }
	    return true;
	}
}