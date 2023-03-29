package project3;

import java.util.StringTokenizer;
import java.util.ArrayList;
import java.util.Collections;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.ImageIcon;
import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.Dimension;

/**
 * Display all components of 24-point game. The components are a refresh button, a panel with four labels with card 
 * image icons, a text field for an expression, and a verify button.
 * @author Qi Wang
 * @version 1.0
 */
@SuppressWarnings("serial")
public class TwentyFourPointsPanel extends JPanel{
	  /**
	   * The refresh button
	   */
	  private JButton refresh;
	  /**
	   * The verify button
	   */
	  private JButton verify;
	  /**
	   * The cards panel
	   */
	  private JPanel cards;
	  /**
	   * The expression text field
	   */
	  private JTextField expression;
	  /**
	   * The first card label
	   */
	  private JLabel card1;
	  /**
	   * The second card label
	   */
	  private JLabel card2;
	  /**
	   * The third card label
	   */
	  private JLabel card3;
	  /**
	   * The fourth card label
	   */
	  private JLabel card4;
	  /**
	   * The 52 image icons
	   */
	  private ImageIcon[] cardIcons = new ImageIcon[52];
	  /**
	   * THe 52 integers from 1 to 52
	   */
	  private ArrayList<Integer> list = new ArrayList<Integer>();
	  
	  /**
	   * Current card values
	   */
	  private ArrayList<Integer> currentCardValues = new ArrayList<Integer>();
	
	  /**
	   * Constructs a 24-point game panel.
	   */
	  public TwentyFourPointsPanel() {
		this.setPreferredSize(new Dimension(350,180));
		this.setLayout(new BorderLayout());
		
		//Load all 52 numbers that will be shuffled.
	    for (int i = 0; i < 52; i++){
	      this.list.add(i);
	    }
	    // Load the image icons
	    for (int i = 0; i < 52; i++){
	      this.cardIcons[i] = new ImageIcon("image/card/" + (i + 1) + ".png");
	    }
	
	    // refresh panel
	    JPanel panel1 = new JPanel(new FlowLayout(FlowLayout.RIGHT));
	    this.refresh = new JButton("Refresh");
	    panel1.add(this.refresh);
	    
	    // card panel
	    this.card1 = new JLabel();
	    this.card2 = new JLabel();
	    this.card3 = new JLabel();
	    this.card4 = new JLabel();
	    this.cards = new JPanel();
	    this.cards.add(this.card1);
	    this.cards.add(this.card2);
	    this.cards.add(this.card3);
	    this.cards.add(this.card4);
	
	    //expression panel
	    this.verify = new JButton("Verify");
	    this.expression = new JTextField(8);
	    JPanel panel3 = new JPanel(new BorderLayout());
	    panel3.add(new JLabel("Enter an expression: "), BorderLayout.WEST);
	    panel3.add(this.expression, BorderLayout.CENTER);
	    panel3.add(this.verify, BorderLayout.EAST);
	
	    this.add(panel1, BorderLayout.NORTH);
	    this.add(this.cards, BorderLayout.CENTER);
	    this.add(panel3, BorderLayout.SOUTH);
	    
	    //Chooses the first four cards after they are shuffled. Changes card image icons accordingly. 
	    this.refresh();
	    
	    
	    TwentyFourPointsActionListener listener = new TwentyFourPointsActionListener(this);
	    this.refresh.addActionListener(listener);
	    this.verify.addActionListener(listener);
	 }
	  
	  /**
	   * Verifies if numbers of the expression matches the numbers of the cards.
	   * @return A boolean value specifying if numbers of the expression matches the numbers of the cards
	   */
	  @SuppressWarnings("deprecation")
	public boolean correctNumbers() {
		// Constructs a string tokenizer for the specified expression. 
		// The delimiters are ()+-/* that are not returned as tokens.
		// Only operands in the expression are returned as tokens. 
	    StringTokenizer tokens = new StringTokenizer(this.expression.getText().trim(), "()+-/*", false);
	    
	    // The array list of operands of this expression
	    ArrayList<Integer> valueList = new ArrayList<Integer>();
	
	    // Each token is returned as a string that can be used to make an Integer object.
	    while(tokens.hasMoreTokens()){
	      //valueList.add(Integer.parseInt(tokens.nextToken()));
	    	valueList.add(new Integer(tokens.nextToken()));
	    }
	
	    Collections.sort(valueList);
	    Collections.sort(this.currentCardValues);
	
	    return valueList.equals(this.currentCardValues);
	  }
	
	  /**
	   * Evaluates current expression, and return a value to indicate if the result is equal to 24. 
	   * Converts this infix expression into a postfix form, and evaluates the postfix form. 
	   * @return A boolean value specifying if the result is equal to 24 
	   * @throws StackException if expression failed
	   */
	  public boolean evaluate() throws StackException {
		  Expression exp = new Expression(this.expression.getText().trim());
		  return exp.evaluate() == 24;
	  }
	
	  /**
	   * Chooses the first four cards after they are shuffled. Changes card image icons accordingly. 
	   */
	  public void refresh() {
	  	//Clear the expression
		this.expression.setText(null);
		
		//Shuffle the list of cards(integers)
		Collections.shuffle(this.list);
		
		//Pick the first four as the fours cards
		int index1 = this.list.get(0);
		int index2 = this.list.get(1);
		int index3 = this.list.get(2);
		int index4 = this.list.get(3);
		
		//Change card image icons accordingly
		this.card1.setIcon(this.cardIcons[index1]);
		this.card2.setIcon(this.cardIcons[index2]);
		this.card3.setIcon(this.cardIcons[index3]);
		this.card4.setIcon(this.cardIcons[index4]);
				
		//Clear the previous card values, and add new card values
		//Card values 1 to 13 repeat
		this.currentCardValues.clear();
		this.currentCardValues.add(index1 % 13 + 1);
		this.currentCardValues.add(index2 % 13 + 1);
		this.currentCardValues.add(index3 % 13 + 1);
		this.currentCardValues.add(index4 % 13 + 1);
	  }
	  
	  /**
	   * Returns a reference to this refresh button.
	   * @return A reference to a button
	   */
	  public JButton getRefresh(){
		  return this.refresh;
	  }
	  
	  /**
	   * Returns a reference to this verify button.
	   * @return A reference to a button
	   */
	  public JButton getVerify(){
		  return this.verify;
	  }
}

  