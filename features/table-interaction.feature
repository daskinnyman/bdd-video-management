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

  Scenario: User can filter with empty data and no results
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "NonExistent" in the filter input for "Title" column
    When I click on the search button for "Title" column
    Then I should see no results message

  Scenario: User can filter by multiple columns simultaneously
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "Active" in the filter input for "Status" column
    When I click on the search button for "Status" column
    When I type "Title 1" in the filter input for "Title" column
    When I click on the search button for "Title" column
    Then I should see only rows matching both filters

  Scenario: User can filter by pressing Enter key in filter input
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "Title 1" in the filter input for "Title" column
    When I press Enter key in the filter input
    Then I should see the table filtered to show only rows with "Title 1"

  Scenario: User can view empty table with no data
    Given I have a table with 0 lines of data
    When I view the table
    Then I should see empty table message

  Scenario: User can sort table by different columns
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the "ID" column header
    Then I should see the table sorted by the "ID" column in ascending order
    When I click on the "Status" column header
    Then I should see the table sorted by the "Status" column in ascending order

  Scenario: User can filter with special characters and spaces
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "  Title 1  " with spaces in the filter input for "Title" column
    When I click on the search button for "Title" column
    Then I should see the table filtered to show only rows with "Title 1"

  Scenario: User can clear all filters at once
    Given I have a table with 3 lines of data
    When I view the table
    When I click on the toggle all filters button
    When I type "Title 1" in the filter input for "Title" column
    When I click on the search button for "Title" column
    When I type "Active" in the filter input for "Status" column
    When I click on the search button for "Status" column
    Then I should see filtered results
    When I click on the clear button for "Title" column
    When I click on the clear button for "Status" column
    Then I should see all data without any filters

  Scenario: User can scroll table and trigger bottom reached callback
    Given I have a table with 10 lines of data
    When I view the table
    When I scroll to the bottom of the table
    Then I should see the onBottomReached callback triggered

  Scenario: User can see loading state with skeleton rows
    Given I have a table with 3 lines of data
    When I view the table with loading state
    Then I should see the table with data

