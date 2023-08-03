package Assignment4;

/**
 * Edge object for use in ADT graph
 * @author peter
 * Contains the vertex this edge originates from, and the vertex it connects to.
 * Also contains the weight between the two vertices, which is 0 if none was specified.
 */
public class Edge {

	//this and other implies the graph can be interpreted to be directional, if desired.
	Vertex thisVertex, otherVertex;
	int weight;
	
	/**
	 * Edge constructor
	 * @param mine - the vertex the edge originates from.
	 * @param other - the vertex the edge terminates at.
	 * @param weight - weight between vertices.
	 */
	public Edge(Vertex mine, Vertex other, int weight)
	{
		thisVertex = mine;
		otherVertex = other;
		this.weight = weight;
	}
	
	/**
	 * Compare this edge to another.
	 * An edge varies if any of its components vary.
	 * @param other - edge to compare to 
	 * @return boolean - true if the same edge object.
	 */
	public boolean equals(Edge other)
	{
		if (!this.thisVertex.compareTo(other.thisVertex)||
				!this.otherVertex.compareTo(other.otherVertex) ||
				this.weight != other.weight)
			return false;
		return true;
	}
}
