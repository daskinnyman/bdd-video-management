Feature: Upload Video
    Scenario: Upload a video
        Given I am on the upload video page
        When I click the upload button
        Then I should open a file chooser
        Then I should see a file input
        Then I choose a video file with a valid format
        Then I fill the title
        Then I fill the description
        Then I choose a video tag
        Then I should see a success message

    Scenario: Upload a video with empty file
        Given I am on the upload video page
        Then I fill the title
        Then I fill the description
        Then I choose a video tag
        Then I leave the file input empty
        Then I should see an error message

    Scenario: Upload a video with an empty title
        Given I am on the upload video page
        When I click the upload button
        Then I should open a file chooser
        Then I should see a file input
        Then I choose a video file with a valid format
        Then I leave the title empty
        Then I fill the description
        Then I choose a video tag   
        Then I should see an error message

    Scenario: Upload a video with an empty tag
        Given I am on the upload video page
        When I click the upload button
        Then I should open a file chooser
        Then I should see a file input
        Then I choose a video file with a valid format
        Then I fill the title
        Then I fill the description
        Then I leave the tag empty
        Then I should see an error message
