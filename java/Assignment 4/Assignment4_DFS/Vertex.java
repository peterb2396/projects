package Assignment4;

import java.util.ArrayList;

/**
 * Vertex object which contains a value representing this object.
 * For use in ADT Graph.
 * @author peter
 * 
 */
public class Vertex {

	int value; //Represents this Vertex. It is unique in ADT Graph as sets are disjoint
	ArrayList<Edge> edges = new ArrayList<Edge>(); //All edges directly connected to this
	
	/**
	 * Construct a Vertex with the given value.
	 * @param newValue to assign to this object for identification
	 */
	public Vertex(int newValue)
	{
		value = newValue;
	}
	
	/**
	 * Check if this Vertex edges are the same (in any order) as another Vertex
	 * @param other - Vertex to compare edges with
	 * @return boolean - true if edges are similar (equal edges, any order)
	 */
	public boolean compareEdges(Vertex other)
	{
		//Edges cannot be equal if their count varies
		if (this.edges.size() != other.edges.size())
			return false;
		
		//Edges cannot be equal if we find one that does not equal another
		for(int i = 0; i<edges.size(); i++)
		{
			if (this.edges.get(i).equals(other.edges.get(i)) == false)
				return false;
		}
		//If we made it here, there were no conflicting edges. They're all equal
		return true;
	}
	
	/**
	 * Compare my value to that of another Vertex.
	 * @param other - Checks other vertex value against mine
	 * @return boolean true if the two vertexes have equivalent values
	 */
	public boolean compareValues(Vertex other)
	{
		return (this.value == other.value);
	}
	
	/**
	 * Custom implementation for comparison.
	 * Here I compare with values, but future comparison techniques may be added here
	 * @param other Vertex to compare
	 * @return boolean - true if equal based on comparison
	 */
	public boolean compareTo(Vertex other)
	{
		return compareValues(other);
	}
	
	@Override
	/**
	 * Print out the vertex as its value.
	 * @return String that is just the integer value.
	 */
	public String toString()
	{
		return ""+value;
	}
}
