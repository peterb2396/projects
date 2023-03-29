package Assignment4;
import java.util.*;

/**
 * ADT Graph Implementation
 * @author peter
 * Implements methods that define a Graph
 */
public class Graph implements GraphInterface{

	//Array of vertexes contained in this graph. Each has neighbors (= its edges)
	private ArrayList<Vertex> graph;
	private int numVertices = 0;
	private int numEdges = 0;
	public int graphNumber;
	
	/**
	 * Construct this graph. Initializes a list of Vertices to be filled by the file, or functions.
	 * @param graphNumber - Unique graph index, used for handling / comparing multiple graphs.
	 */
	public Graph(int graphNumber)
	{
		this.graphNumber = graphNumber; //Used to identify this graph when printing.
		graph = new ArrayList<Vertex>(); //Instantiate Vertex list (graph)
	}
	
	
	/**
	 * adds a new vertex to the graph. It begins as its own singleton
	 * @param newValue to add as a vertex
	 * @return the new Vertex
	 */
	public Vertex addVertex(int newValue)
	{
		//The vertex already exists - can only have one, disjoint.
		if (find(newValue) != null)
			return null;
		
		//Setup NEW pair of the Vertex with an empty set of edges 
		graph.add(new Vertex(newValue));
		return graph.get(numVertices++);
	}
	
	/**
	 * Removes the given vertex, and subsequently all edges associated with it.
	 * @param vertex to remove
	 * @return vertex that was removed.
	 */
	public Vertex removeVertex(Vertex vertex)
	{
		if (vertex == null)
			return null;
		
		Vertex removing = find(vertex.value);
		
		//Iterate over each vertex, removing any edges with the given vertex that is being removed.
		GraphIterator itr = new GraphIterator(this);
		while(itr.hasNext())
		{
			Vertex v = itr.next();
			removeEdge(v, removing);
		}
			
		
		graph.remove(removing);
		numVertices--;
		
		return removing;
	}
	
	/**
	 * Create an edge between the existing vertices.
	 * First ensures that both inputs are actually vertices in the graph. If not, makes them
	 * @param value1 - value of the first vertex
	 * @param value2 - value of the second vertex
	 * @param weight - weight of the new edge
	 */
	public boolean makeEdge(int value1, int value2, int weight)
	{
		Vertex vertex1 = find(value1);
		if (vertex1 == null) 
			vertex1 = addVertex(value1);
			
		Vertex vertex2 = find(value2);
		if (vertex2 == null)
			vertex2 = addVertex(value2);
		
		//If this edge does not yet exist, add it
		if (findEdge(vertex1, vertex2) == null) {
			
			vertex1.edges.add(new Edge(vertex1, vertex2, weight));
			//If we make an edge of a vertex to itself, only do so once.
			if (value1 != value2)
				vertex2.edges.add(new Edge(vertex2, vertex1, weight));
			numEdges++;
			return true;
		}
		return false;
	}
	
	/**
	 * Add the given Edge object to the graph, if one does not already exist between the vertices.
	 * @param edge - object containing v1,v2,weight to add.
	 * @return boolean - whether edge could be created.
	 */
	public boolean addExistingEdge(Edge edge)
	{
		//Do not add the edge if it already exists.
		if (findEdge(edge.thisVertex, edge.otherVertex) != null)
			return false;
		
		Vertex vertex1 = find(edge.thisVertex.value);
		if (vertex1 == null) 
			vertex1 = addVertex(edge.thisVertex.value);
			
			
		Vertex vertex2 = find(edge.thisVertex.value);
		if (vertex2 == null) 
			vertex2 = addVertex(edge.thisVertex.value);

		//Add the edge
			
			vertex1.edges.add(new Edge(vertex1, vertex2, edge.weight));
			vertex2.edges.add(new Edge(vertex2, vertex1, edge.weight));
			numEdges++;
		
		return true;
	}
	
	/**
	 * Remove an edge between the given vertices. 
	 * @param v1
	 * @param v2
	 * @return the Edge removed, or null if none existed.
	 */
	public Edge removeEdge(Vertex v1, Vertex v2)
	{
		Edge removing = null;
		if (null != findEdge(v1, v2))
		{	
			//Remove A->B link
			for (Edge edge: v1.edges)
				if (edge.otherVertex == v2)
					removing = edge;
			v1.edges.remove(removing);
			
			//Remove B->A link
			for (Edge edge: v2.edges)
				if (edge.otherVertex == v1)
					removing = edge;
			v2.edges.remove(removing);
			
			numEdges--;
		}
		return removing;
	}
	
	/**
	 * Find the weight between two vertices, if an edge exists.
	 * @param v1 the first vertex
	 * @param v2 the other vertex
	 * @return the weight, or -1 if no edge exists.
	 */
	public int findWeight(Vertex v1, Vertex v2)
	{
		Edge edge = findEdge(v1, v2);
		if (edge == null)
			return -1;
		return edge.weight;
	}
	
	
	/**
	 * Find an edge between the two vertices.
	 * @param v1 the first vertex
	 * @param v2 the other vertex
	 * @return the Edge object between the vertices, or null if none.
	 */
	public Edge findEdge(Vertex v1, Vertex v2)
	{
		for(Edge edge: v1.edges)
			if (edge.otherVertex == v2)
				return edge;
		return null;
		
	}

	/**
	 * Allows the Graph to be printed
	 * Displays each vertex, followed by it's edges in the form (Connected Vertex, Weight Between)
	 * @return String that represents this graph object.
	 */
	@Override
	public String toString()
	{
		String graphStr = "";
		graphStr+="----------GRAPH "+graphNumber+"----------\n";
		graphStr+="Vertex: (Partner, Weight)\n";
		
		GraphIterator itr = new GraphIterator(this);
		
		while(itr.hasNext())
		{
			Vertex vertex = itr.next();
			graphStr+=(vertex.value+": ");
			
			for (Edge edge: vertex.edges)
				graphStr+=("(" + edge.otherVertex + ", "+ edge.weight + ")");
			
			graphStr+="\n";
		}
		return graphStr;
	}
	
	/**
	 * Find the given vertex in the graph
	 * @param key - value of the vertex to look for
	 * @return Vertex found, null if none.
	 */
	public Vertex find(int key)
	{
		GraphIterator itr = new GraphIterator(this);
		while(itr.hasNext())
		{
			Vertex vertex = itr.next();
			
			if (vertex.value == key)
				return vertex;
		}
		return null;
	}
	
	/**
	 * Determine whether this Graph is equal to another.
	 * Equality is defined as having the same set of vertices and edges.
	 * This is intuitive as a graph G = (V, E). As sets are unordered in nature,
	 * it does not matter the location or order, as long as the objects and their edges
	 * are identical. After all, it is a disjoint set of trees in a forest.
	 * @param other - the other graph to test against.
	 * @return boolean - true if graphs are equal, false otherwise.
	 */
	public boolean equals(Graph other)
	{
		//Graphs are not equal if their number of verts or edges vary.
		if (this.getVertexCount() != other.getVertexCount() ||
		this.getEdgeCount() != other.getEdgeCount())
			return false;
		
		boolean match = false;
		//For each vertex, I must ensure I have a match somewhere (anywhere) in the other graph.
		
		//Initialize a new Depth First Search Iterator
		GraphIterator itr = new GraphIterator(this);
		while(itr.hasNext())
		{
			Vertex v = itr.next();
			
			for(int i = 0; i<numVertices; i++)
				//I have a pair! Make sure their edges match, too.
				if (v.compareTo(other.graph.get(i)))
					if (v.compareEdges(other.graph.get(i)))
						match = true;
			
			//Analyzed a Vertex completely. If I did not find a match, rtn false
			//but do not return true if i did, because they may not ALL match.
			if (!match) return false;
		}
		
		//I didn't return meaning i found 0 conflicts. Graphs are equal.
		return true;
		
	}
	
	/**
	 * Get the number of vertices
	 * @return int - num of vertices
	 */
	public int getVertexCount()
	{
		return numVertices;
	}
	
	/**
	 * Get the number of edges
	 * @return int- num of edges
	 */
	public int getEdgeCount()
	{
		return numEdges;
	}
	
	/**
	 * Get all Vertices in the graph
	 * @return ArrayList<Vertex> containing all vertices.
	 */
	public ArrayList<Vertex> getVerts()
	{
		return graph;
	}
}