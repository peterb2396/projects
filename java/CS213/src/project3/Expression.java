package project3;

import java.util.ArrayList;
import java.util.Stack;

//Note: No Static methods. Otherwise, no credits.
public class Expression {
	
	/**
	 * The content of this expression in infix form
	 */
	private String infix;
	
	/**
	 * Construct an expression with no data
	 */
	public Expression(){
		this("0");
	}
	
	/**
	 * Constructor when expression object is created with a given infix exp
	 * @param infix exp
	 */
	public Expression(String infix){
		this.infix = infix;
	}
	
	/**
	 * Converts infix expression to postfix
	 * @return list of strings of postfix expression
	 * @throws StackException if error popping or peeking in algorithm
	 */
	public ArrayList<String> infixToPostfix() throws StackException{
		
	        Stack<Character> stack = new Stack<>();
	        ArrayList<String> postFixList = new ArrayList<>();
	        
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
	                    while(!stack.isEmpty() && precedence(stack.peek())>=precedence(token))
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
	 * Evaluates the post fix expression using stacks 
	 * @return integer result of the operation
	 * @throws StackException if error pushing or pulling from stack
	 */
	public int evaluate() throws StackException {
		
		//Initialize local variables for evaluation
		ArrayList<String> postfix = infixToPostfix();
        GenericStack<Integer> stack = new GenericStack<>();
        
        for(int i=0;i<postfix.size();i++){
        	
            String token = postfix.get(i);
            if(token.charAt(0)=='+'||token.charAt(0)=='-'||token.charAt(0)=='*'||token.charAt(0)=='/'){
                int operand2 = stack.pop();
                int operand1 = stack.pop();
                
                if(token.charAt(0)=='+') //Addition
                    stack.push(operand1 + operand2);
                    
                else if(token.charAt(0)=='-') //Subtraction
                    stack.push(operand1 - operand2);
                    
                else if(token.charAt(0)=='*') //Multiplication
                    stack.push(operand1 * operand2);
                    
                else if(token.charAt(0)=='/') //Division
                	stack.push(operand1 / operand2);
                
                else throw new StackException("Unhandled operator");
                
            }
            else stack.push(Integer.parseInt(token));
        }
        
        return stack.peek();
    }
		
    
	
	
	//Other methods
	//Helper methods
	/**
	 * Returns the precedence of the given parameter c
	 * @param c the integer to check the precedence of 
	 * @return int of precedence or -1 if operator not found
	 */
	int precedence(char c)
    {
		if (c == '+' || c == '-')
			return 1;
		
		if (c == '*' || c == '/')
			return 2;
		
		if (c == '^')
			return 3;
		
		return -1;
    }
}
