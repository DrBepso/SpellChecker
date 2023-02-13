package com.example.springboot.model;
import java.time.LocalDateTime;

public class Info {
    private int words;
    private LocalDateTime time;

    public Info(){}
    public Info(String sentence){
        
        if (sentence == null || sentence.isEmpty()) {
             words = 0; 
        } else{
            String[] wordsSplit = sentence.split("\\s+"); // "\s" = space, and + is so if there multiple spaces
            words = wordsSplit.length;
        }

        time = LocalDateTime.now();
    }

    public int getWords() {
        return words;
    }

    public void setWords(int words) {
        this.words = words;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }
}
