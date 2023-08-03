package project4;

public class Address {
	
	public String street;
	public String city;
	public String state;
	public String zipcode;
	
	public Address(String street, String city, String state, String zipcode) {
		this.street = street;
		this.city = city;
		this.state = state;
		this.zipcode = zipcode;
	}
	
	public String toString() {
		return street + " "+ city + " "+ state + " " +zipcode;
	}
	

}
