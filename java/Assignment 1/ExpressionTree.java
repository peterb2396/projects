package assignment1;

import java.util.ArrayList;
import java.util.Stack;



/**
 * Incorporates methods of a binary tree for use with an Expression list to determine equality,
 * multiple orders of traversal, and to translate expressions into postfix, infix, prefix, and
 * to construct a tree with the translated representation of the expression.
 * @author Peter
 * @version 1.0
 */
public class ExpressionTree {
	  /**
	   * The root of this tree
	   */
	  protected Node<?> root;

	  /**
	   * The list of data to be traversed
	   */
	  protected ArrayList<Node<?>> list = new ArrayList<Node<?>>();
	  
	  /**
	   * The inifx expression
	   */
	  public String infix;
	  
	  /**
	   * The postfix expression
	   */
	  public String postfix;
	  
	  /**
	   * Postfix list used for tree construction
	   */
	  private ArrayList<String> postFixList;
	  
	  /**
	   * The prefix expression
	   */
	  public String prefix;
	  
	  
	  
	  /**
	   * Creates an empty binary tree.
	   */
	  public ExpressionTree() {
		  this.root = null;
	  }
      
	  /**
	   * Constructs a binary tree from a given infix expression.
	   * @param infix the expression to use
	   */
	  public ExpressionTree(String infix) {
	     this.infix = infix;
	     
	     infixToPostfix(infix);
	     
	     this.postfix = "";
	     for (String s: postFixList)
	     {
	    	 this.postfix+=s;
	     }
	        
	     
	     this.root = constructTree();
	     
	  } 	
	  
	  
	  /**
	   * Generates a postfix representation of the given infix expression
	   * @return ArrayList<String> of the tokens of the postfix expression
	   * @param infix the expression to convert to postfix
	   */
		public ArrayList<String> infixToPostfix(String infix) {
			
	        Stack<Character> stack = new Stack<>();
	        postFixList = new ArrayList<>();
	        
	        boolean lastDigitOfNum = false;
	        for(int i=0;i<infix.length();i++){
	            char token = infix.charAt(i);
	            
	            //If open parenthesis, push this token
	            if(token=='(')
	            {
	                stack.push(token);
	                lastDigitOfNum = false;
	            }
	            else if(token==')')
	            {
	                lastDigitOfNum = false;
	                
	                //Until stack empty
	                while(!stack.isEmpty()){
	                	
	                    if(stack.peek()=='(')
	                    {
	                        stack.pop();
	                        break;
	                    }
	                    else postFixList.add(""+stack.pop());
	                }
	            }
	            else if(token=='+' || token=='-' || token=='*' || token=='/')
	            {
	                lastDigitOfNum = false;
	                
	                if(stack.isEmpty())
	                    stack.push(token);
	                
	                else
	                {
	                    while(!stack.isEmpty() && precedence(stack.peek().toString())>=precedence(String.valueOf(token)))
	                        postFixList.add(""+stack.pop());
	                        
	                    stack.push(token);
	                }
	            }
	            else
	            {
	                if(lastDigitOfNum)
	                {
	                    String last = postFixList.get(postFixList.size()-1);
	                    last+=token;
	                    postFixList.set(postFixList.size()-1, last);
	                }
	                else postFixList.add(""+token);
	                
	                lastDigitOfNum = true;
	            }
	        }
	        //Append remaining items from the stack to the post fix string
	        while(!stack.isEmpty())
	            postFixList.add(""+stack.pop());
	        
	        return postFixList;
	    }
		
		/**
		 * Returns the precedence of the given operator o
		 * @param o the operator to check the precedence of 
		 * @return int of precedence or -1 if operator not found
		 */
		private int precedence(String o)
	    {
			if (o.equals("+") || o.equals("-"))
				return 1;
			
			if (o.equals("*")|| o.equals("/"))
				return 2;
			
			return -1;
	    }
		
	  /**
	   * Construct the tree utilizing the stored postfix expression field
	   * @return Node<?> The root node of the created tree
	   */
	  private Node<?> constructTree() {
	        Stack<Node<?>> stk = new Stack<Node<?>>();
	        Node<?> node;
	 
	        // Iterate over each token of the postfix expression
	        for (String token: postFixList) {
	        	
	            // If it's an operand, push to stack as the element of a new node
	            if (precedence(token) == -1) {
	                stk.push(new Node<String>(token));
	                
	            } else // operator so set its operands as children, then take the place
	            	   // of their children in the stack.
	            	{
	            	node = new Node<String>(token);
	 
	            	//The two most recent stack entries become
	            	//the tree's children
	                node.setRight(stk.pop());
	                node.setLeft(stk.pop());
	 
	                //This tree then sits in the stack to be possibly
	                //further appended to an additional tree
	                stk.push(node);
	            }
	        }
	 
	        //when finished, the stack will only contain one tree representing the expression.
	        return stk.pop();
	    }
	  /**
	   * Traverses in preorder. 
	   * @param Node A reference to a tree node
	   */
	  public void preorder(Node<?> node) {
	    if(node != null){
	    	this.list.add(node);
	    	preorder(node.getLeft());
	    	preorder(node.getRight());
	    	
	    }
	  }

	  /**
	   * Traverses in inorder. 
	   * @param Node A reference to a tree node
	   */
	  public void inorder(Node<?> node) {
		  if(node != null) {
		    	inorder(node.getLeft());
		    	this.list.add(node);
		    	inorder(node.getRight());
		    	
		    }
	  }

	  /**
	   * Traverses in postorder. 
	   * @param Node A reference to a tree node
	   */
	  public void postorder(Node<?> node) {
		  if(node != null){
			    postorder(node.getLeft());
		    	postorder(node.getRight());
		    	this.list.add(node);
		    	
		    }
	  }
	  
	  /**
	   * @Override
	   * Determine congruence between this tree and another.
	   * Two trees are congruent if they contain identical elements.
	   * @param other - the tree to compare to
	   * @return boolean representation of congruence
	   */
	  public boolean equals(ExpressionTree other) {
		  
		  //Clear tokens to ensure both trees are ordered using identical traversal methods.
		  this.list.clear();
		  other.list.clear();
		  
		  preorder(getRoot());
		  other.preorder(other.getRoot());
		 
		  
		  //Analyze the tokens for any discrepancies that would negate the proposition of congruence
		  if (this.list.size() == other.list.size()) {
			  for(int i = 0; i<list.size(); i++) {
				  if (!((String.valueOf(this.list.get(i))).equals(String.valueOf(other.list.get(i))) ))
					  return false;
				  	  //End the test and return false because we discovered an inconsistency at i
					  
			  }
			//if we make it here, the loop did not find an inconsistency thus equal.
			  return true; 
		  }
		  //if we make it here,  the two trees are of different size, thus not equal.
		  return false;
	  }

	  /**
	   * @Override
	   * Display the tree as a string containing it's information such as traversals, expression 
	   * and what type it's elements are.
	   * @return String representation of the object
	   */
	  public String toString() {
		  	return "This tree represents elements of type "+this.getRoot().getElement().getClass() +",\n"
		  			+ "generated by it's expression: "+this.infix +",\nalso represented in prefix: "+this.prefix
		  			+" and postfix: "+this.postfix;
	  }
	  /**
	   * Returns the element in the tree's root.
	   * @return A reference to the item of the root
	   */
	  public Node<?> getRoot() {
	    
	      return this.root;
	    
	  }
}
