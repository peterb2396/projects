package project3;

import java.awt.HeadlessException;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JPanel;
import javax.swing.JOptionPane;

/**
 * Process actions event triggered by a button 
 * @author Qi Wang
 *
 */
public class TwentyFourPointsActionListener implements ActionListener{
	/**
	 * A reference to a panel
	 */
	private JPanel panel;
	
	/**
	 * Constructs an action listener with a panel.
	 * @param panel A reference to a panel
	 */
	public TwentyFourPointsActionListener(JPanel panel){
		this.panel = panel;
	}
	
	/**
     * Invoked when an action occurs.
     * @param e A reference to an action event object
     */
    public void actionPerformed(ActionEvent e){
    	if(this.panel instanceof TwentyFourPointsPanel){
    		TwentyFourPointsPanel temp = (TwentyFourPointsPanel)this.panel;
    		if(e.getSource() == temp.getVerify()){
    		
			  // Check whether all numbers in the expression are currently selected
			  if (!temp.correctNumbers()) {
			    JOptionPane.showMessageDialog(null, "The numbers in the expression don't \nmatch the numbers in the set ");
			  }else{
			    // Check whether the expression evaluates to 24.
				  try {
					if (temp.evaluate()) {
						  JOptionPane.showMessageDialog(null, "Correct");
					  } else {
						  JOptionPane.showMessageDialog(null, "Incorrect result");
					 }
				} catch (HeadlessException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				} catch (StackException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			  }
			}
    		
    		if(e.getSource() == temp.getRefresh()){
    			temp.refresh();
    		}
    		
    	}
    }

}
