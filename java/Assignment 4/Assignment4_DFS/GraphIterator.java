package Assignment4;

import java.util.Iterator;

/**
 * Depth First Search for a vertex.
 * @author peter
 * Iterators over vertices by going deep first.
 */
public class GraphIterator implements Iterator<Vertex> {

	Graph graph; //Reference to ADT Graph
	int depth; //Depth we're currently at when looking for the vertex
	
	/**
	 * Construct iterator with reference to graph and start at the top (depth of 0)
	 * @param g
	 */
	public GraphIterator(Graph g)
	{
		graph = g;
		depth = 0; //We start at the top and search deeper
	}
	
	/**
	 * Can I search any deeper? NOTE: Our depth must be less then the maximum depth.
	 * @return whether or not I can go deeper (boolean)
	 */
	@Override
	public boolean hasNext() {
		return (depth < graph.getVertexCount());
	}

	
	/**
	 * Retrieves the next deep vertex and increments the depth for the next iteration.
	 * @return the Vertex at the current depth.
	 */
	@Override
	public Vertex next() {
		return graph.getVerts().get(depth++);
	}

	

}
