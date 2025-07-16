Feature: Login

  Scenario: Login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    Then I click the login button
    Then I should see a success message

  Scenario: Login with invalid credentials
    Given I am on the login page
    When I enter invalid credentials
    Then I click the login button
    Then I should see an error message on the form

  Scenario: Login with empty credentials
    Given I am on the login page
    When I enter empty credentials
    Then the login button should be disabled

  Scenario: Login with invalid email
    Given I am on the login page
    When I enter an invalid email
    Then I click the login button
    Then I should see an error message on the field that is not valid

  Scenario: Login with invalid password
    Given I am on the login page
    When I enter an invalid password
    Then I click the login button
    Then I should see an error message on the field that is not valid