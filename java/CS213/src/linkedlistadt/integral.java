package linkedlistadt;

public class integral {

	public static void main(String[] args) {
		double sum = 0;
		
		double denom = 3;
		double num = 1;
		
		for (int i = 0; i<100; i++)
		{
			if (i%2 == 0)
				num = 1;
			else num = 2;
			
			sum+=(num/denom);
			denom*=3;
		}
		
		System.out.println(sum);

	}

}
