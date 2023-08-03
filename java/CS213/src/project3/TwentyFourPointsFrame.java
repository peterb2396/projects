package project3;

import javax.swing.JFrame;

/**
 * Displays 24-point game. 
 * @author Qi Wang
 * @version 1.0
 */
@SuppressWarnings("serial")
public class TwentyFourPointsFrame extends JFrame{
	/**
	 * Constructs an interface of 24-point game. 
	 */
	public TwentyFourPointsFrame(){
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setTitle("24-Point Card Game");
		
		TwentyFourPointsPanel panel = new TwentyFourPointsPanel();
		this.getContentPane().add(panel);
		
		this.pack();
		this.setVisible(true);
	}
}
