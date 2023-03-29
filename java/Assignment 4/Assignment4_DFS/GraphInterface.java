package Assignment4;

/**
 * Design for an ADT Graph
 * @author peter
 * Determines and defines necessary methods for creating an ADT Graph.
 */
public interface GraphInterface {
	
	/**
	 * adds a new vertex to the graph. 
	 * @param newValue to add as a vertex
	 * @return the new Vertex
	 */
	public Vertex addVertex(int newValue);
	
	/**
	 * Removes the given vertex, and subsequently all edges associated with it.
	 * @param vertex to remove
	 * @return vertex that was removed.
	 */
	public Vertex removeVertex(Vertex vertex);
	
	/**
	 * Create an edge between the existing vertices.
	 * @param value1 - value of the first vertex
	 * @param value2 - value of the second vertex
	 * @param weight - weight of the new edge
	 */
	public boolean makeEdge(int value1, int value2, int weight);
	
	/**
	 * Add the given Edge object to the graph, if one does not already exist between the vertices.
	 * @param edge - object containing v1,v2,weight to add.
	 * @return boolean - whether edge could be created.
	 */
	public boolean addExistingEdge(Edge edge);
	
	/**
	 * Remove an edge between the given vertices. 
	 * @param v1
	 * @param v2
	 * @return the Edge removed, or null if none existed.
	 */
	public Edge removeEdge(Vertex v1, Vertex v2);
	
	/**
	 * Find the weight between two vertices, if an edge exists.
	 * @param v1 the first vertex
	 * @param v2 the other vertex
	 * @return the weight, or -1 if no edge exists.
	 */
	public int findWeight(Vertex v1, Vertex v2);
	
	/**
	 * Allows the Graph to be printed.
	 * @return String that represents this graph object.
	 */
	@Override
	public String toString();
	
	/**
	 * Find the given vertex in the graph
	 * @param key - value of the vertex to look for
	 * @return Vertex found, null if none.
	 */
	public Vertex find(int key);
	
	/**
	 * Determine whether this Graph is equal to another.
	 * @param other - the other graph to test against.
	 * @return boolean - true if graphs are equal, false otherwise.
	 */
	public boolean equals(Graph other);

   }
