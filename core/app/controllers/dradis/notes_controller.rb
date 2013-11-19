module Dradis
  class NotesController < AuthenticatedController
    before_filter :find_or_initialize_node
    before_filter :find_or_initialize_note, :except => [ :index ]

    # Retrieve the list of Note objects associated with a given Node.
    # Formats supported: :json
    def index
      @notes = @node.notes
      respond_to do |format|
        format.json {
          render :json => {:success => true, :data => @notes}
        }
      end
    end

    def create
      respond_to do |format|
        if @note.save
          format.json { render json: {success: true, data: @note} }
        else
          format.json { render json: {success: false, message: @note.errors.full_messages.join(',')}}
        end
      end
    end

    def update
      respond_to do |format|
        if @note.update_attributes(@note_attrs)
          format.json { render json: {success: true} }
        else
          # ExtJS expects HTTP 200, instead of status: :unprocessable_entity
          format.json { render json: {success: false, message: @note.errors.full_messages.join(',')}}
        end
      end
    end

    # TODO - implement destroy

    private
    # For most of the operations of this controller we need to identify the Node
    # we are working with. This filter sets the @node instance variable if the 
    # give :node_id is valid.
    def find_or_initialize_node
      begin 
        @node = Node.find(params[:node_id])
      rescue
        flash[:error] = 'Node not found'
        redirect_to root_path
      end
    end

    # Once a valid @node is set by the previous filter we look for the Note we
    # are going to be working with based on the :id passed by the user.
    def find_or_initialize_note

      # Because we may need the attrs here and in the :update method, we must
      # save the clean list in an attribute
      whitelist = [:text, :category_id]
      attrs = params[:note] || ActiveSupport::JSON.decode(params[:data], symbolize_keys: true)
      @note_attrs = attrs.reject{|k,v| !whitelist.include?(k)}

      if params[:id]
        unless @note = Note.find(params[:id])
          render_optional_error_file :not_found
        end
      else
        @note = @node.notes.new(@note_attrs)
        @note.author = current_user
      end
      # TODO
      # @note.updated_by = current_user
    end    
  end
end