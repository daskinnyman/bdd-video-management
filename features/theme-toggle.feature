Feature: Theme Toggle
  As a user
  I want to be able to switch between light and dark themes
  So that I can use the application comfortably in different lighting conditions

  Scenario: User can toggle from light to dark theme
    Given I am on the home page
    When I click the theme toggle button
    Then the theme should change to dark mode
    And the theme toggle button should show the sun icon

  Scenario: User can toggle from dark to light theme
    Given I am on the home page in dark mode
    When I click the theme toggle button
    Then the theme should change to light mode
    And the theme toggle button should show the moon icon

  Scenario: Theme preference persists across page navigation
    Given I am on the home page in dark mode
    When I navigate to the login page
    Then the theme should remain in dark mode
    And the theme toggle button should be visible

  Scenario: Theme toggle is available on all pages
    Given I am on the admin dashboard
    Then I should see the theme toggle button
    When I navigate to the user dashboard
    Then I should see the theme toggle button
    When I navigate to the video upload page
    Then I should see the theme toggle button 