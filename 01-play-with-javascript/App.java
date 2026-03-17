import java.util.ArrayList;
import java.util.LinkedList;

class MyList<T> implements Iterable<T> {
    // ..
    public java.util.Iterator<T> iterator() {
        // ...
        return new java.util.Iterator<T>() {
            public boolean hasNext() {
                // ...
                return false;
            }

            public T next() {
                // ...
                return null;
            }
        };
    }
}

public class App {
    public static void main(String[] args) {

        ArrayList<String> list1 = new ArrayList<>();
        for (String item : list1) {
            System.out.println(item);
        }

        LinkedList<String> list2 = new LinkedList<>();
        for (String item : list2) {
            System.out.println(item);
        }

        MyList<String> list3 = new MyList<>();
        for (String item : list3) {
            System.out.println(item);
        }

    }
}
