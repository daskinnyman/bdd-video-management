Feature: Table Interaction and Filtering

  Scenario: User can sort table by clicking on column header
    Given I have a table with 3 lines of data
    When I view the table
    Then I should see 3 rows in the table
    When I click on the "Title" column header
    Then I should see the table sorted by the "Title" column in ascending order
    When I click on the "Title" column header again
    Then I should see the table sorted by the "Title" column in descending order

  Scenario: User can expand filter inputs by clicking toggle button
    Given I have a table with 3 lines of data
    When I view the table
    Then I should see the filter inputs are hidden by default
    When I click on the toggle all filters button
    Then I should see all filter inputs are visible

  Scenario: User can filter table by typing and clicking search button
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "Title 1" in the filter input for "Title" column
    When I click on the search button for "Title" column
    Then I should see the table filtered to show only rows with "Title 1"

  Scenario: User can clear the filter by clicking on the clear button in the filter input
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "Title 1" in the filter input for "Title" column
    When I click on the search button for "Title" column
    Then I should see the table filtered to show only rows with "Title 1"
    When I click on the clear button for "Title" column
    Then I should see the table data without filtering

