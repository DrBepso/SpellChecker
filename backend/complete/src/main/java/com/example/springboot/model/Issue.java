package com.example.springboot.model;

import org.languagetool.rules.RuleMatch;

public class Issue {
    private String type;
    private Match match;

    public Issue(){}
    public Issue(String message, RuleMatch match){
        type = match.getRule().getCategory().getName();
	    this.match = new Match(
			  message.substring(match.getFromPos(), match.getToPos()),
			  match.getFromPos(),
			  match.getToPos(),
			  match.getSuggestedReplacements()
			);
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
