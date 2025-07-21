Feature: Table Display and Structure

  Scenario: User can see table rows from given data
    Given I have a table with 3 lines of data
    When I view the table
    Then I should see 3 rows in the table

  Scenario: User can see empty data icon when data is empty
    Given I have a table with 0 lines of data
    When I view the table
    Then I should see an empty data icon with a message "No data found"

  Scenario: User can sort table by clicking on column header
    Given I have a table with 3 lines of data
    When I view the table
    Then I should see 3 rows in the table
    When I click on the "Title" column header
    Then I should see the table sorted by the "Title" column

  Scenario: User can load more data by scrolling to the bottom of the table
    Given I have a table with 30 lines of data
    When I view the table
    When I scroll to the bottom of the table
    Then I should see the next 10 rows in the table

  Scenario: User can see more table columns by scrolling to the right
    When I scroll to the right of the table
    Then I should see the next 10 columns in the table
