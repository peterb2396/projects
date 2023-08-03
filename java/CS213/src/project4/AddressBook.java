package project4;

public class AddressBook {
	private int count;
	private BinarySearchTree<Contact> tree;
	private TreeIterator<Contact> itr;
	
	public AddressBook() { //Instantiate a tree for this new address book, and give it an iterator
		tree = new BinarySearchTree<Contact>();
		itr = this.tree.iterator();
	}
	
	public void addContact(Contact c)
	{
		tree.insert(c);
		count++;
	}
	
	public void removeContact(Contact c)
	{
		tree.delete(c);
		count--;
	}
	//also acts as get method
	public Contact search(String s) {
		return tree.search(tree.root, s).getElement();
	}
	
	public void removeAll()
	{
		tree.root = null;
		count = 0;
	}
	public boolean isEmpty()
	{
		return tree.isEmpty();
	}
	
	public BinarySearchTree<Contact> getTree() {
		return this.tree;
	}
	
	public TreeIterator<Contact> getIterator(){
		return this.itr;
	}
}
