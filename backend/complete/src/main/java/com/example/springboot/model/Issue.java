package com.example.springboot.model;
public class Issue {
    private String type;
    private Match match;

    public Issue(){}
    public Issue(String type, Match match) {
        this.type = type;
        this.match = match;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public Match getMatch() {
        return match;
    }
    public void setMatch(Match match) {
        this.match = match;
    }

    
}
