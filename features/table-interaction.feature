Feature: Table Interaction and Filtering

  Scenario: User can see the long text in the table cell being truncated
    When I hover over the table cell with long text
    Then I should see the tooltip with the full text

  Scenario: User can filter table by typing in the filter input in the column header
    When I type in the filter input in the column header
    Then I should see the table filtered by the input

  Scenario: User can clear the filter by clicking on the clear button in the filter input
    When I type in the filter input in the column header
    Then I should see the table filtered by the input
    When I click on the clear button in the filter input
    Then I should see the table data without filtering

  Scenario: User can trigger row action by clicking on the action button
    When I click on the action button in the first row
    Then I should see the dropdown menu with a list of actions
    When I click on the "Edit" action
    Then I should see the edit modal open

  Scenario: User can  change the order of the table by dragging the column header
    When I drag the column header
    Then I should see the table sorted by the column

  Scenario: User can hide a column by clicking on the column visibility toggle
    When I click on the column visibility toggle
    Then I should see the dropdown menu with a list of checkboxes

  Scenario: User can modify table column width by dragging column header
    When I drag the column header
    Then I should see the resize indicator
    When I drag the indicator to the right
    Then I should see the column width modified