package project4;

public class Contact implements Comparable<Contact> {
	public String name;
	public Address address;
	public String phone;
	
	public Contact(String name, Address addy, String phone) {
		this.name = name; this.address = addy; this.phone = phone;
	}

	@Override
	public int compareTo(Contact o) {
		if (o == null)
		{
			return 1;
		}
		else
		return name.compareTo(o.name);
	}
	
	@Override
	public String toString() {
		return name + " " + address + " " + phone;
	}
}
